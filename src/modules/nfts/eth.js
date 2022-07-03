const UnmarshalApi = require('./../../services/unmarshal');

const config = require('./../../enums/chains');

function getWalletAllNFTs(address, skip, limit) {
    const service = new UnmarshalApi({ address, config: config.eth });
    return service.getWalletAllNFTs(skip, limit);
}

function getWalletNFTTransactions(address, skip, limit) {
    const service = new UnmarshalApi({ address, config: config.eth });
    return service.getWalletNFTTransactions(skip, limit);
}

module.exports = {
    getWalletAllNFTs,
    getWalletNFTTransactions
}