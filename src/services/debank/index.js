// @ts-nocheck
const axios = require('axios');

class DebankApi {
    /**
    * @param {Object} data - Info about wallet instance.
    * @param data.address - The address of the wallet.
    * @param {Object} data.config - The config of the network.
    */
    constructor(data) {
        const { address, config } = data;
        this.chain = config.chain;
        this.address = address;
    }

    baseUrl = 'https://openapi.debank.com/v1';

    get getPageToken() {
        return {
            name: 'Page',
            symbol: 'PAGE',
            logo: 'https://crypto-page-app.herokuapp.com/page.png',
            balance: 0,
            percentChange: 0,
            price: 0,
            balancePrice: 0
        }
    }

    getTokenDataFromItem(item) {
        const balance = (item.balance / 10 ** item.contract_decimals) || 0;
        return {
            name: item.name,
            symbol: item.symbol,
            logo: item.logo,
            balance: item.amount,
            percentChange: 0,
            price: item.price || 0,
            balancePrice: (item.price * balance) || 0
        }
    }

    async getTokensFromApi(skip, limit) {
        const { data } = await axios.get(`${this.baseUrl}/user/token_list?id=${this.address}&chain_id=${this.chain}&is_all=true`);
        if (!data?.length) {
            return [];
        }
        return data;
    }

    async getWalletTokens(skip, limit) {
        const data = await this.getTokensFromApi(skip, limit);

        const items = [this.getPageToken];
        for (const item of data) {
            const token = this.getTokenDataFromItem(item);
            items.push(token);
        }
        const tokens = items.slice(skip * limit, skip * limit + limit).filter(e => (e.balance || e.symbol === 'PAGE'));
        return { tokens, count: items.length };
    }

    async getNFTsFromApi() {
        const { data } = await axios.get(`${this.baseUrl}/user/nft_list?id=${this.address}&chain_id=${this.chain}&is_all=true`);
        if (!data?.length) {
            return [];
        }
        return data;
    }

    getNFTDataFromItem(item) {
        return {
            from: this.address,
            to: this.address,
            comments: 0,
            date: new Date(),
            name: item.name || '',
            collectionName: item.contract_name || '',
            description: item.description || '',
            usdPrice: item.usd_price,
            image: item.content,
            contract_address: item.contract_id || '',
            tokenId: item.inner_id,
            attributes: item.attributes
        }
    }

    async getWalletAllNFTs(skip, limit) {
        try {
            let data = await this.getNFTsFromApi();
            data = data.filter(e => e.content);
            const items = data.slice(skip * limit, skip * limit + limit);
            const list = [];
            for (const item of items) {
                const nft = this.getNFTDataFromItem(item);
                list.push(nft);
            }
            return { count: data.length, list };
        } catch {
            return { count: 0, list: [] };
        }
    }

}

module.exports = DebankApi;