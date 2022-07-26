const TronGridApi = require('./../../services/trongrid');

function getWalletAllTransactions(address, {page, pageSize}) {
    const service = new TronGridApi({ address });
    return service.getWalletAllTransactions(page, pageSize);
}

function getWalletTokenTransfers(address, skip, limit) {
    const service = new TronGridApi({ address });
    return service.getWalletTokenTransfers(skip, limit);
}

module.exports = {
    getWalletAllTransactions,
    getWalletTokenTransfers
}