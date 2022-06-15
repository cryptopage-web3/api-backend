const UnmarshalApi = require('./../../services/unmarshal');

const config = require('./../../enums/chains');

function getWalletTokens(address, skip, limit) {
    const service = new UnmarshalApi({ address, config: config.eth });
    return service.getWalletTokens(skip, limit);
}

module.exports = {
    getWalletTokens
}