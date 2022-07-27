import { ITronTransaction } from './types';
import { toUrlQueryParams } from '../../util/url-util';
import { injectable } from 'inversify';
const axios = require('axios');
const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
});
const config = require('./../../enums/chains');
const { getCoinPrice } = require('../../cache/coins');

@injectable()
export class TronGridApi {
    baseUrl = 'https://api.trongrid.io/v1/'

    getTransactionDataFromItem(item): ITronTransaction {
        const value = item.raw_data.contract[0].parameter.value.amount / 10 ** 6 || 0;
        return {
            title: 'Transfer',
            from: tronWeb.address.fromHex(
                item.raw_data.contract[0].parameter.value.owner_address
            ),
            to: tronWeb.address.fromHex(
                item.raw_data.contract[0].parameter.value.to_address
            ),
            fee: 0,
            value,
            valueUSD: getCoinPrice(config.tron.nativeCoinId) * value,
            hash: item.txID,
            explorerUrl: config.tron.explorerUrl + item.txID,
            tokenSymbol: config.tron.nativeCoinSymbol,
            date: new Date(item.block_timestamp)
        }
    }

    async getTransactionsFromApi(address: string, pageSize: number, fingerprint?: string) {
        const queryParamss = toUrlQueryParams({limit: pageSize, fingerprint}),
            url = `${this.baseUrl}accounts/${address}/transactions?${queryParamss}`

        const { data } = await axios.get(url);
        if (!data?.data?.length) {
            return {items:[], nextPageToken: null};
        }

        return {
            items: data.data,
            nextPageToken: data.meta.fingerprint
        }
    }

    async getWalletAllTransactions(address: string, pageSize: number, fingerprint?: string) {
        const {items, nextPageToken } = await this.getTransactionsFromApi(address, pageSize, fingerprint);
        const transactions = items.map(i => this.getTransactionDataFromItem(i))

        return {
            count: items.length,
            transactions,
            continue:{
                fingerprint: nextPageToken
            }
        };
    }

    async getWalletTokenTransfers(address, pageSize: number, fingerprint?: string) {
        const { transactions, count } = await this.getWalletAllTransactions(address, pageSize, fingerprint);
        const items = transactions
        return { count, transactions: items };
    }
}