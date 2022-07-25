const UnmarshalApi = require('./../../services/unmarshal');

const config = require('./../../enums/chains');

function getWalletAllTransactions(address, {skip, limit}) {
    const service = new UnmarshalApi({ address, config: config.matic });
    return service.getWalletAllTransactions(skip, limit);
}

function getTransactionDetails(txHash) {
    const service = new UnmarshalApi({ config: config.matic });
    return service.getTransactionDetails(txHash);
}

function getWalletTokenTransfers(address, skip, limit) {
    const service = new UnmarshalApi({ address, config: config.matic });
    return service.getWalletTokenTransfers(skip, limit);
}

module.exports = {
    getWalletAllTransactions,
    getWalletTokenTransfers
}