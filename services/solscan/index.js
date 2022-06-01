// @ts-nocheck
const axios = require('axios');

const config = require('./../../enums/chains');

class SolScanApi {
    /**
    * @param {Object} data - Info about wallet instance.
    * @param data.address - The address of the wallet.
    */
    constructor(data) {
        const { address } = data;

        if (address.length !== 44) {
            throw new Error('Address is invalid.');
        }

        this.address = address;
        this.explorerUrl = config.sol.explorerUrl;
    }

    baseUrl = 'https://public-api.solscan.io/account/';

    getTransactionDataFromItem(item) {
        return {
            title: 'Transfer',
            from: item.signer[0],
            to: '',
            fee: item.fee / 10 ** 9,
            value: item.lamport / 10 ** 9,
            hash: item.txHash,
            explorerUrl: this.explorerUrl + item.txHash,
            tokenSymbol: config.sol.nativeCoinSymbol,
            date: new Date(item.blockTime * 1000)
        }
    }

    async getTransactionsFromApi() {
        const { data } = await axios.get(`${this.baseUrl}transactions?account=${this.address}&limit=200`);
        if (!data?.length) {
            return [];
        }
        return data;
    }

    async getWalletAllTransactions(skip, limit) {
        const data = await this.getTransactionsFromApi();
        const items = data.slice(skip * limit, skip * limit + limit);
        const transactions = [];
        for (const item of items) {
            const transaction = this.getTransactionDataFromItem(item);
            transactions.push(transaction);
        }
        return { count: data.length, transactions };
    }

    async getWalletTokenTransfers(skip, limit) {
        const { transactions, count } = await this.getWalletAllTransactions(0, Number.MAX_VALUE);
        const items = transactions.filter(e => e.title === 'Transfer').slice(skip * limit, skip * limit + limit);
        return { count, transactions: items };
    }
}

module.exports = SolScanApi;

