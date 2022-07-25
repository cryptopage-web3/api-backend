const TronGridApi = require('./../../services/trongrid');

function getWalletAllTransactions(address, {skip, limit}) {
    const service = new TronGridApi({ address });
    return service.getWalletAllTransactions(skip, limit);
}

function getWalletTokenTransfers(address, skip, limit) {
    const service = new TronGridApi({ address });
    return service.getWalletTokenTransfers(skip, limit);
}

module.exports = {
    getWalletAllTransactions,
    getWalletTokenTransfers
}