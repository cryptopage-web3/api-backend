const axios = require('axios');
const Web3 = require('web3');

const typeList = ['image', 'audio', 'video'];
const types = { '.jpg': 'image', '.png': 'image', '.gif': 'image', '.jpeg': 'image', '.webp': 'image', '.mp4': 'video', '.mp3': 'audio' };

function parseUrl(url) {
    if (!url) return;
    if (url.startsWith('ipfs://ipfs/')) {
        return url.replace('ipfs://', 'https://ipfs.io/')
    } else if (url.startsWith('ipfs://')) {
        return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    } else {
        return url;
    }
}

async function getType(link) {
    if (!link) return;

    for (let extension in types) {
        if (link.endsWith(extension)) {
            return types[extension];
        }
    }

    let type;
    try {
        if (link.startsWith('https://') || link.startsWith('http://')) {
            const result = await axios.head(link);
            const contentType = result.headers['content-type'].split('/')[0];
            type = contentType;
            if (typeList.includes(type)) {
                return type;
            }
        }
    } catch (e) { }
}

async function getDataFromUrl(link) {
    const url = parseUrl(link);
    const type = await getType(url);
    return { url, type }
}

async function getFieldFromContract(rpc, address, key) {
    try {
        const web3 = new Web3(rpc);
        const minABI = [
            {
                "constant": true,
                "inputs": [],
                "name": key,
                "outputs": [{ "name": key, "type": "string" }],
                "type": "function"
            }
        ];
        const contract = new web3.eth.Contract(minABI, address);
        const info = await contract.methods[key]().call();
        return info;
    } catch {
        return '';
    }
}

async function getDateFromBlock(rpc, blockNum) {
    try {
        const web3 = new Web3(rpc);
        const block = await web3.eth.getBlock(blockNum);
        return new Date(block.timestamp * 1000);
    } catch {
        return new Date();
    }
}

module.exports = {
    getDataFromUrl,
    getFieldFromContract,
    getDateFromBlock
}