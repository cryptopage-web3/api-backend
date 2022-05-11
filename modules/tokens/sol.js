const CovalentApi = require('./../../services/covalent');

const config = require('./../../enums/chains');

function getWalletTokens(address) {
    const service = new CovalentApi({ address, config: config.sol });
    return service.getWalletTokens();
}

module.exports = {
    getWalletTokens
}