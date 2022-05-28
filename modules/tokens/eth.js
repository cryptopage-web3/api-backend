const CovalentApi = require('./../../services/covalent');

const config = require('./../../enums/chains');

function getWalletTokens(address, skip, limit) {
    const service = new CovalentApi({ address, config: config.eth });
    return service.getWalletTokens(skip, limit);
}

module.exports = {
    getWalletTokens
}