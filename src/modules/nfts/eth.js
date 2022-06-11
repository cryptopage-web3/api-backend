const DebankApi = require('./../../services/debank');

const config = require('./../../enums/chains');

function getWalletAllNFTs(address, skip, limit) {
    const service = new DebankApi({ address, config: config.eth });
    return service.getWalletAllNFTs(skip, limit);
}

module.exports = {
    getWalletAllNFTs
}