const SolScanApi = require('./../../services/solscan');

function getWalletAllTransactions(address, {page, pageSize}) {
    const service = new SolScanApi({ address });
    return service.getWalletAllTransactions(page, pageSize);
}

function getWalletTokenTransfers(address, skip, limit) {
    const service = new SolScanApi({ address });
    return service.getWalletTokenTransfers(skip, limit);
}

module.exports = {
    getWalletAllTransactions,
    getWalletTokenTransfers
}