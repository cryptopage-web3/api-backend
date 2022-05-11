const SolScanApi = require('./../../services/solscan');

function getWalletAllTransactions(address, skip, limit) {
    const service = new SolScanApi({ address });
    return service.getWalletAllTransactions(skip, limit);
}

module.exports = {
    getWalletAllTransactions
}