const Web3 = require('web3');

const rpcURL = 'https://goerli.infura.io/v3/b09e910a12ad4770aee90cb3bcfcf65e';

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

export { getEthBalance, getBalanceOfToken };