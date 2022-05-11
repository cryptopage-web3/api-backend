// @ts-nocheck
const axios = require('axios');
const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
});
const config = require('./../../enums/chains');

class TronGridApi {
    /**
    * @param {Object} data - Info about wallet instance.
    * @param data.address - The address of the wallet.
    */
    constructor(data) {
        const { address } = data;

        if (address.length !== 34) {
            throw new Error('Address is invalid.');
        }

        this.address = address;
        this.explorerUrl = config.tron.explorerUrl;
    }

    baseUrl = 'https://api.trongrid.io/v1/';

    getTransactionDataFromItem(item) {
        return {
            title: 'Transfer',
            from: tronWeb.address.fromHex(
                item.raw_data.contract[0].parameter.value.owner_address
            ),
            to: tronWeb.address.fromHex(
                item.raw_data.contract[0].parameter.value.to_address
            ),
            fee: 0,
            value: item.raw_data.contract[0].parameter.value.amount / 10 ** 6 || 0,
            hash: item.txID,
            explorerUrl: this.explorerUrl + item.txID,
            tokenSymbol: config.tron.nativeCoinSymbol
        }
    }

    async getWalletAllTransactions(skip, limit) {
        const { data } = await axios.get(`${this.baseUrl}accounts/${this.address}/transactions?skip=${skip}&limit=${limit}`);
        if (!data?.data?.length) {
            return [];
        }
        const items = data.data;
        const transactions = [];
        for (const item of items) {
            const transaction = this.getTransactionDataFromItem(item);
            transactions.push(transaction);
        }
        return transactions;
    }
}

module.exports = TronGridApi;

