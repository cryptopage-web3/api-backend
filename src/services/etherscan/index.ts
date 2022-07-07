// @ts-nocheck
const axios = require('axios');

export class EtherscanApi {
    constructor(apiKey: string) {
        this.apiKey = apiKey;
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