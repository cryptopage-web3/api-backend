const SolScanApi = require('./../../services/solscan');

function getWalletAllTransactions(address, {page, pageSize}) {
    const service = new SolScanApi({ address });
    return service.getWalletAllTransactions(page, pageSize);
}

function getWalletTokenTransfers(address, {page, pageSize}) {
    const service = new SolScanApi({ address });
    return service.getWalletTokenTransfers(page, pageSize);
}

module.exports = {
    getWalletAllTransactions,
    getWalletTokenTransfers
}