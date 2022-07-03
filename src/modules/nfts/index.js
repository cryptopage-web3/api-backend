const chains = require('./../../enums/chains');

let blockchainModules = {};
for(let chain in chains) {
    try {
        blockchainModules[chain] = require(`./${chain}`);
    } catch {}
}

async function getWalletAllNFTs(address, blockchain, skip, limit) {
    if (!blockchainModules[blockchain]) {
        throw new Error(`${blockchain} not supported.`);
    }

    return blockchainModules[blockchain].getWalletAllNFTs(address, skip, limit);
}

async function getWalletNFTTransactions(address, blockchain, skip, limit) {
    if (!blockchainModules[blockchain]) {
        throw new Error(`${blockchain} not supported.`);
    }

    return blockchainModules[blockchain].getWalletNFTTransactions(address, skip, limit);
}

module.exports = {
    getWalletAllNFTs,
    getWalletNFTTransactions
}