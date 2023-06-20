import { getChainConf } from '../../enums/chains';
import { toUrlQueryParams } from '../../util/url-util';
import { ChainId } from '../../modules/transactions/types';
import { inject, injectable } from 'inversify';
import { IDS } from '../../types/index';
import { Axios } from 'axios';
import { PriceCache } from '../../cache/coins';
import { envToString } from '../../util/env-util';
import { IToken } from '../../modules/tokens/types';

@injectable()
export class CovalentApi {
    @inject(IDS.NODE_MODULES.axios) _axios:Axios
    @inject(IDS.CACHE.PriceCache) _priceCache: PriceCache
    @inject(IDS.CONFIG.PageToken) _pageToken: IToken

    chainId: string
    chainName: string
    mainCoinId: string
    explorerUrl: string
    nativeCoinSymbol: string

    constructor() {
        const config: any = getChainConf(ChainId.sol);
        this.chainId = config.chainId;
        this.mainCoinId = config.nativeCoinId;
        this.explorerUrl = config.explorerUrl;
        this.nativeCoinSymbol = config.nativeCoinSymbol;
    }

    apiKey = envToString('COVALENT_API_KEY');
    baseUrl = 'https://api.covalenthq.com/v1';

    getTokenDataFromItem(item):IToken {
        const balance = (item.balance / 10 ** item.contract_decimals) || 0;
        return {
            name: item.contract_name,
            symbol: item.contract_ticker_symbol,
            logo: item.logo_url,
            balance,
            percentChange: 0,
            price: item.quote_rate || 0,
            balancePrice: (item.quote_rate * balance) || 0,
            address: ''
        }
    }

    async getTokensFromApi(address) {
        const url = `${this.baseUrl}/${this.chainId}/address/${address}/balances_v2/?key=${this.apiKey}`
        const { data } = await this._axios.get(url);
        if (!data?.data?.items?.length) {
            return [];
        }
        const { items } = data.data;
        return items;
    }

    async getWalletTokens(address) {
        const data = await this.getTokensFromApi(address);

        const items:IToken[] = [this._pageToken];
        for (const item of data) {
            const token = this.getTokenDataFromItem(item);
            items.push(token);
        }
        const tokens = items.filter(e => (e.balance || e.symbol === 'PAGE'));
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
            valueUSD: this._priceCache.getCoinPrice(this.mainCoinId) * value,
            tokenSymbol,
            tokenAmount,
            tokenAddress,
            hash: item.tx_hash,
            explorerUrl: this.explorerUrl + item.tx_hash,
            date: new Date(item.block_signed_at)
        }
    }

    async getTransactionsFromApi(address: string, page: number, pageSize: number) {
        const queryParams = toUrlQueryParams({'page-number': page, 'page-size': pageSize, key: this.apiKey})
        const url = `${this.baseUrl}/${this.chainId}/address/${address}/transactions_v2/?${queryParams}`
        
        const { data } = await this._axios.get(url);
        if (!data?.data?.items?.length) {
            return [];
        }
        return data.data.items;
    }

    async getWalletAllTransactions(address:string, page: number, pageSize: number) {
        const data = await this.getTransactionsFromApi(address, page, pageSize);
        
        const transactions = data.map(i => this.getTransactionDataFromItem(i))

        return { count: data.length, transactions };
    }

    async getWalletTokenTransfers(skip, limit) {
       /* try {
            const { transactions, count } = await this.getWalletAllTransactions(0, Number.MAX_VALUE);
            const items = transactions.filter(e => e.title === 'Transfer').slice(skip * limit, skip * limit + limit);
            return { count, transactions: items };
        } catch {
            return { count: 0, transactions: [] };
        }*/
    }
}