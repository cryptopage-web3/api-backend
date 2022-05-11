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
            fee: item.fee  / 10 ** 9,
            value: item.lamport / 10 ** 9,
            hash: item.txHash,
            explorerUrl: this.explorerUrl + item.txHash,
            tokenSymbol: config.sol.nativeCoinSymbol
        }
    }

    async getWalletAllTransactions(skip, limit) {
        const { data } = await axios.get(`${this.baseUrl}/transactions?account=${this.address}&limit=1000`);
        if (!data?.length) {
            return [];
        }
        const items = data.slice(skip * limit, skip * limit + limit);
        const transactions = [];
        for (const item of items) {
            const transaction = this.getTransactionDataFromItem(item);
            transactions.push(transaction);
        }
        return transactions;
    }
}

module.exports = SolScanApi;

