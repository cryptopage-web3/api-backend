const { UnmarshalApi } = require('../../services/unmarshal/UnmarhalApi');

const config = require('./../../enums/chains');

function getWalletTokens(address, skip, limit) {
    const service = new UnmarshalApi({ address, config: config.bsc });
    return service.getWalletTokens(skip, limit);
}

module.exports = {
    getWalletTokens
}