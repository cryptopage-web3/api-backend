const chains = require('./../../enums/chains');

let blockchainModules = {};
for(let chain in chains) {
    blockchainModules[chain] = require(`./${chain}`)
}

async function getWalletTokens(address, blockchain) {

    if (!blockchainModules[blockchain]) {
        throw new Error(`${blockchain} not supported.`);
    }

    return blockchainModules[blockchain].getWalletTokens(address);

}

module.exports = {
    getWalletTokens
}