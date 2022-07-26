const { UnmarshalApi } = require('../../services/unmarshal/UnmarhalApi');

const config = require('./../../enums/chains');

function getWalletAllNFTs(address, skip, limit) {
    const service = new UnmarshalApi({ address, config: config.bsc });
    return service.getWalletAllNFTs(skip, limit);
}

function getWalletNFTTransactions(address, skip, limit) {
    const service = new UnmarshalApi({ address, config: config.bsc });
    return service.getWalletNFTTransactions(skip, limit);
}

module.exports = {
    getWalletAllNFTs,
    getWalletNFTTransactions
}