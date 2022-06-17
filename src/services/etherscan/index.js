// @ts-nocheck
const axios = require('axios');

class EtherscanApi {
    /**
    * @param {Object} data - Info about wallet instance.
    * @param data.address - The address of the wallet.
    * @param {Object} data.config - The config of the network.
    */
    constructor(data) {
        const { address, config } = data;
        this.apiUrl = config.apiUrl;
        this.apiKey = config.apiKey;
        this.address = address;
    }

    async getTxCount() {
        try {
            const { data } = await axios.get(`${this.apiUrl}module=account&action=txlist&address=${this.address}&startblock=0&endblock=999999999999&sort=asc&apikey=${this.apiKey}`, {timeout: 10000});
            return data.result.length;
        } catch {
            return 0;
        }
    }
}

module.exports = EtherscanApi;