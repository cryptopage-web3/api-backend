// @ts-nocheck
const axios = require('axios');
const conf = require('./../../enums/chains');
const { getCoinPrice } = require('../../cache/coins');

class CovalentApi {
    /**
    * @param {Object} data - Info about wallet instance.
    * @param data.address - The address of the wallet.
    * @param {Object} data.config - The config of the network.
    */
    constructor(data) {
        const { address, config } = data;
        this.chainId = config.chainId;
        this.mainCoinId = config.nativeCoinId;
        this.explorerUrl = config.explorerUrl;
        this.nativeCoinSymbol = config.nativeCoinSymbol;

        if (this.chainId !== conf.sol.chainId && !address.match('^0x[a-fA-F0-9]{40}$')) {
            throw new Error('Address is invalid.');
        }

        this.address = address;
    }

    apiKey = 'ckey_d826382c6f1b430c97ad2521c0d';
    baseUrl = 'https://api.covalenthq.com/v1';

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
            name: item.contract_name,
            symbol: item.contract_ticker_symbol,
            logo: item.logo_url,
            balance,
            percentChange: 0,
            price: item.quote_rate || 0,
            balancePrice: (item.quote_rate * balance) || 0
        }
    }

    async getTokensFromApi(skip, limit) {
        const { data } = await axios.get(`${this.baseUrl}/${this.chainId}/address/${this.address}/balances_v2/?key=${this.apiKey}`);
        if (!data?.data?.items?.length) {
            return [];
        }
        const { items } = data.data;
        return items;
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

    getTransactionDataFromItem(item) {
        const contractCall = !!item.log_events?.length;
        const title = contractCall ? item.log_events[0].decoded?.name : 'Transfer';
        let tokenAmount, tokenAddress;
        let tokenSymbol = this.nativeCoinSymbol;

        if (contractCall && title === 'Transfer') {
            const data = item.log_events[0];
            tokenSymbol = data.sender_contract_ticker_symbol;
            tokenAddress = data.decoded?.params[1]?.value;
            tokenAmount = data.decoded?.params[2]?.value / 10 ** data.sender_contract_decimals;
        }
        const value = item.value / 10 ** 18;
        return {
            title: title || 'Transfer',
            from: item.from_address,
            to: item.to_address,
            fee: (item.gas_spent * item.gas_price) / 10 ** 18,
            value,
            valueUSD: getCoinPrice(this.mainCoinId) * value,
            tokenSymbol,
            tokenAmount,
            tokenAddress,
            hash: item.tx_hash,
            explorerUrl: this.explorerUrl + item.tx_hash,
            date: new Date(item.block_signed_at)
        }
    }

    async getTransactionsFromApi() {
        const { data } = await axios.get(`${this.baseUrl}/${this.chainId}/address/${this.address}/transactions_v2/?key=${this.apiKey}`);
        if (!data?.data?.items?.length) {
            return [];
        }
        return data.data.items;
    }

    async getWalletAllTransactions(skip, limit) {
        try {
            const data = await this.getTransactionsFromApi();
            const items = data.slice(skip * limit, skip * limit + limit);
            const transactions = [];
            for (const item of items) {
                const transaction = this.getTransactionDataFromItem(item);
                transactions.push(transaction);
            }
            return { count: data.length, transactions };
        } catch {
            return { count: 0, transactions: [] };
        }
    }

    async getWalletTokenTransfers(skip, limit) {
        try {
            const { transactions, count } = await this.getWalletAllTransactions(0, Number.MAX_VALUE);
            const items = transactions.filter(e => e.title === 'Transfer').slice(skip * limit, skip * limit + limit);
            return { count, transactions: items };
        } catch {
            return { count: 0, transactions: [] };
        }
    }
}

module.exports = CovalentApi;

