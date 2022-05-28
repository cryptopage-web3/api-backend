// @ts-nocheck
const axios = require('axios');
const conf = require('./../../enums/chains');

class CovalentApi {
    /**
    * @param {Object} data - Info about wallet instance.
    * @param data.address - The address of the wallet.
    * @param {Object} data.config - The config of the network.
    */
    constructor(data) {
        const { address, config } = data;
        this.chainId = config.chainId;
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
            logo: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjIiIGJhc2VQcm9maWxlPSJ0aW55LXBzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48dGl0bGU+TG9nbzwvdGl0bGU+PHN0eWxlPnRzcGFuIHsgd2hpdGUtc3BhY2U6cHJlIH0gLnNocDAgeyBmaWxsOiAjMjg4YWYyIH0gLnNocDEgeyBmaWxsOiAjMjM3OWQ1IH0gLnNocDIgeyBmaWxsOiAjMjVhYWZmIH0gLnNocDMgeyBmaWxsOiAjMmE5MWZmIH0gPC9zdHlsZT48cGF0aCBpZD0iU2hhcGUgMTggY29weSIgY2xhc3M9InNocDAiIGQ9Ik0wLjU2IDQuMjlMMTEuMjYgOS4yMUwyMy43OSA0Ni45OUwwLjU2IDM1LjE1TDAuNTYgNC4yOVoiIC8+PHBhdGggaWQ9IlNoYXBlIDE4IiBjbGFzcz0ic2hwMSIgZD0iTTcuNTQgMEwyMy43OCAxNi4wNkwyMy44NSA0Ny41NEw3LjkyIDM0LjQ0TDcuNTQgMFoiIC8+PHBhdGggaWQ9IlNoYXBlIDE4IGNvcHkgMiIgY2xhc3M9InNocDIiIGQ9Ik00Ny4yMSA0LjI5TDM2LjUgOS4yMUwyMy45NyA0Ni45OUw0Ny4yMSAzNS4xNUw0Ny4yMSA0LjI5WiIgLz48cGF0aCBpZD0iU2hhcGUgMTggY29weSAzIiBjbGFzcz0ic2hwMyIgZD0iTTM5Ljk2IDBMMjMuMDcgMTYuMDZMMjMuMTQgNDcuNTRMMzkuNTggMzQuNDRMMzkuOTYgMFoiIC8+PC9zdmc+',
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
        const items = data.data.items.slice(skip * limit, skip * limit + limit);
        return items;
    }

    async getWalletTokens(skip, limit) {
        const data = await this.getTokensFromApi(skip, limit);

        const tokens = [];
        for (const item of data) {
            const token = this.getTokenDataFromItem(item);
            tokens.push(token);
        }
        return tokens.filter(e => e.balance);
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
        return {
            title: title || 'Transfer',
            from: item.from_address,
            to: item.to_address,
            fee: (item.gas_spent * item.gas_price) / 10 ** 18,
            value: item.value / 10 ** 18,
            tokenSymbol,
            tokenAmount,
            tokenAddress,
            hash: item.tx_hash,
            explorerUrl: this.explorerUrl + item.tx_hash
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
        const data = await this.getTransactionsFromApi();
        const items = data.slice(skip * limit, skip * limit + limit);
        const transactions = [];
        for (const item of items) {
            const transaction = this.getTransactionDataFromItem(item);
            transactions.push(transaction);
        }
        return transactions;
    }

    async getWalletTokenTransfers(skip, limit) {
        const data = await this.getWalletAllTransactions(0, Number.MAX_VALUE);
        const items = data.filter(e => e.title === 'Transfer').slice(skip * limit, skip * limit + limit);
        return items;
    }
}

module.exports = CovalentApi;

