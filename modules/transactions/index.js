const chains = require('./../../enums/chains');

let blockchainModules = {};
for(let chain in chains) {
    try {
        blockchainModules[chain] = require(`./${chain}`);
    } catch {}
}

async function getWalletAllTransactions(address, blockchain, skip, limit) {
    if (!blockchainModules[blockchain]) {
        throw new Error(`${blockchain} not supported.`);
    }

    return blockchainModules[blockchain].getWalletAllTransactions(address, skip, limit);

}

module.exports = {
    getWalletAllTransactions
}