// @ts-nocheck
const axios = require('axios');
const conf = require('./../../enums/chains');
const { getCoinPrice } = require('../../cache/coins');

const EtherscanApi = require('../etherscan');

class UnmarshalApi {
    /**
    * @param {Object} data - Info about wallet instance.
    * @param data.address - The address of the wallet.
    * @param {Object} data.config - The config of the network.
    */
    constructor(data) {
        const { address, config } = data;
        this.chainName = config.chainName;
        this.mainCoinId = config.nativeCoinId;
        this.explorerUrl = config.explorerUrl;
        this.nativeCoinSymbol = config.nativeCoinSymbol;

        if (address && !address.match('^0x[a-fA-F0-9]{40}$')) {
            throw new Error('Address is invalid.');
        }

        this.address = address;
        this.etherscan = new EtherscanApi(data);
    }

    apiKey = '3Z1C4SxhUE6Cj7P5zxWv47katMQQXlffeHz61xe9';
    baseUrl = 'https://api.unmarshal.com';
    txStatus = {
        completed: 'Success',
        error: 'Fail'
    }

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
            address: item.contract_address,
            logo: item.logo_url,
            balance,
            percentChange: item.quote_pct_change_24h,
            price: item.quote_rate || 0,
            balancePrice: (item.quote_rate * balance) || 0
        }
    }

    async getTokensFromApi(skip, limit) {
        const { data } = await axios.get(`${this.baseUrl}/v1/${this.chainName}/address/${this.address}/assets?auth_key=${this.apiKey}`);
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

    getTransactionDataFromItem(item) {
        let title = item.type.split('_').map(e => e[0].toUpperCase() + e.substr(1)).join(' ');
        let tokenSymbol, tokenAmount, tokenAddress;
        if (title === 'Send' && item.sent?.length) {
            title = 'Transfer';
            const info = item.sent[0];
            tokenSymbol = info.symbol;
            tokenAddress = info.token_id;
            tokenAmount = info.value / 10 ** info.decimals;
        }
        if (title === 'Receive' && item.received?.length) {
            title = 'Transfer';
            const info = item.received[0];
            tokenSymbol = info.symbol;
            tokenAddress = info.token_id;
            tokenAmount = info.value / 10 ** info.decimals;
        }
        
        const value = item.value / 10 ** 18;
        return {
            title: title || 'Transfer',
            from: item.from,
            to: item.to,
            fee: item.fee / 10 ** 18,
            value,
            valueUSD: getCoinPrice(this.mainCoinId) * value,
            tokenSymbol,
            tokenAmount,
            tokenAddress,
            hash: item.id,
            explorerUrl: this.explorerUrl + item.id,
            date: new Date(item.date * 1000)
        }
    }

    async getTransactionsFromApi(skip, limit) {
        if (skip === 0) skip = 1;
        const { data } = await axios.get(`${this.baseUrl}/v3/${this.chainName}/address/${this.address}/transactions?page=${skip}&pageSize=${limit}&auth_key=${this.apiKey}`);
        const { transactions, total_txs } = data;
        if (!transactions?.length) {
            return { items: [], count: 0 };
        }
        const count = await this.etherscan.getTxCount();
        return { items: transactions, count };
    }

    async getWalletAllTransactions(skip, limit) {
        try {
            const { items, count } = await this.getTransactionsFromApi(skip, limit);
            const transactions = [];
            for (const item of items) {
                const transaction = this.getTransactionDataFromItem(item);
                transactions.push(transaction);
            }
            return { count, transactions };
        } catch(e) {
            return { count: 0, transactions: [] };
        }
    }

    async getWalletTokenTransfers(skip, limit) {
        try {
            const { transactions, count } = await this.getWalletAllTransactions(skip, limit);
            const items = transactions.filter(e => e.title === 'Transfer');
            return { count, transactions: items };
        } catch {
            return { count: 0, transactions: [] };
        }
    }

}

module.exports = UnmarshalApi;

