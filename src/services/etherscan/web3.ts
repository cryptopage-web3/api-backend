const Web3 = require('web3');
const axios = require('axios');

const rpcURL = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

async function getEthBalance(walletAddress) {
    const web3 = new Web3(rpcURL);
    const balance = await web3.eth.getBalance(walletAddress);
    return balance / 10 ** 18;
}

async function getBalanceOfToken(walletAddress, tokenAddress, decimals = 18) {
    const minABI = [
        // balanceOf
        {
            "constant": true,
            "inputs": [{ "name": "_owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "type": "function"
        }
    ];
    const web3 = new Web3(rpcURL);
    const contract = new web3.eth.Contract(minABI, tokenAddress);
    const balance = await contract.methods.balanceOf(walletAddress).call();
    return balance / 10 ** decimals;
}

function getTransactionCount(walletAddress) {
    const web3 = new Web3(rpcURL);
    return web3.eth.getTransactionCount(walletAddress)
}

function normalizeUrl(url) {
    if (!url) return;
    if (url.startsWith('ipfs://ipfs/')) {
        return url.replace('ipfs://', 'https://ipfs.io/')
    } else if (url.startsWith('ipfs://')) {
        return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    } else {
        return url;
    }
}

async function getTokenMetadata(tokenAddress, tokenId) {
    try {
        const minABI = [
            { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
        ];
        const web3 = new Web3(rpcURL);
        const contract = new web3.eth.Contract(minABI, tokenAddress);
        const metadataUri = await contract.methods.tokenURI(tokenId).call();
        const { data } = await axios.get(normalizeUrl(metadataUri));
        return {
        image: data.image,
            description: data.description,
            attributes: data.attributes || []
        }
    } catch (e) {
        return {
            image: '',
            description: '',
            attributes: []
        }
    }
}

async function getTransactionData(txHash) {
    const web3 = new Web3(rpcURL);
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    const transaction = await web3.eth.getTransaction(txHash);
    const data = { ...receipt, ...transaction };
    const block = await web3.eth.getBlock(data.blockNumber);
    const { timestamp } = block;
    const info = {
        txHash,
        block: data.blockNumber,
        nonce: data.nonce,
        status: "Success",
        value: Number(data.value),
        fee: data.gasUsed * data.gasPrice / 10 ** 18,
        valueUSD: 0,
        feeUSD: 0,
        transfers: [],
        action: data.input ? "Smart Contract Executed" : "Transfer",
        date: new Date(timestamp * 1000),
        logs: data.logs
    }
    return info;
}

export { getEthBalance, getBalanceOfToken, getTransactionCount, getTokenMetadata, getTransactionData };