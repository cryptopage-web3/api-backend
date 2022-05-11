const CovalentApi = require('./../../services/covalent');

const config = require('./../../enums/chains');

function getWalletAllTransactions(address, skip, limit) {
    const service = new CovalentApi({ address, config: config.bsc });
    return service.getWalletAllTransactions(skip, limit);
}

module.exports = {
    getWalletAllTransactions
}