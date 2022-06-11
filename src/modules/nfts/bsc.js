const DebankApi = require('./../../services/debank');

const config = require('./../../enums/chains');

function getWalletAllNFTs(address, skip, limit) {
    const service = new DebankApi({ address, config: config.bsc });
    return service.getWalletAllNFTs(skip, limit);
}

module.exports = {
    getWalletAllNFTs
}