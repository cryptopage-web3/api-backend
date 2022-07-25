const SolScanApi = require('./../../services/solscan');

function getWalletAllTransactions(address, {skip, limit}) {
    const service = new SolScanApi({ address });
    return service.getWalletAllTransactions(skip, limit);
}

function getWalletTokenTransfers(address, skip, limit) {
    const service = new SolScanApi({ address });
    return service.getWalletTokenTransfers(skip, limit);
}

module.exports = {
    getWalletAllTransactions,
    getWalletTokenTransfers
}