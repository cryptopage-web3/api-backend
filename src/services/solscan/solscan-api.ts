import { injectable } from 'inversify';
import { toUrlQueryParams } from '../../util/url-util';
const axios = require('axios');

const config = require('./../../enums/chains');
const { getCoinPrice } = require('../../cache/coins');

@injectable()
export class SolScanApi {
    baseUrl = 'https://public-api.solscan.io/account/';
    mainCoinId = config.sol.nativeCoinId;
    explorerUrl = config.sol.explorerUrl;

    getTransactionDataFromItem(item) {
        const value = item.lamport / 10 ** 9;
        return {
            title: 'Transfer',
            from: item.signer[0],
            to: item.signer[1] || item.signer[0],
            fee: item.fee / 10 ** 9,
            value,
            valueUSD: getCoinPrice(this.mainCoinId) * value,
            hash: item.txHash,
            explorerUrl: this.explorerUrl + item.txHash,
            tokenSymbol: config.sol.nativeCoinSymbol,
            date: new Date(item.blockTime * 1000)
        }
    }

    async getTransactionsFromApi(address: string, pageSize: number, beforeHash?: string) {
        const queryParams = toUrlQueryParams({account: address, limit: pageSize, beforeHash})
        const url = `${this.baseUrl}transactions?${queryParams}`
        const { data } = await axios.get(url);

        if (!data?.length) {
            return [];
        }
        return data;
    }

    async getWalletAllTransactions(address: string, pageSize: number, beforeHash?: string) {
        const transactions = await this.getTransactionsFromApi(address, pageSize, beforeHash);
        let lastTxHash: string = transactions.length > 0 ? transactions[transactions.length - 1].txHash : undefined

        return {
            count: transactions.length,
            transactions: transactions.map(i => this.getTransactionDataFromItem(i)),
            beforeHash: lastTxHash
        };
    }
}