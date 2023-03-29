import { ChainId } from '../../modules/transactions/types';
import { getChainConf } from '../../enums/chains';
import { inject, injectable } from 'inversify';
import { IDS } from '../../types/index';
import { Axios } from 'axios';
import { ContractDetailsRepo } from '../../orm/repo/contract-details-repo';
import { INftItem, INftsList } from '../../modules/nfts/types';
import { IUnmarshanNftItem, IUnmarshalNftResponse, UnmarshalNftDetails, IUnmarshalNtfTxsResponse } from './types';
import { UnmarshalApiHelper } from './helper';
import { PriceCache } from '../../cache/coins';
import { normalizeUrl } from '../../util/url-util';
import { ErrorLogRepo } from '../../orm/repo/error-log-repo';
import { envToString } from '../../util/env-util';
import { Web3Util } from '../web3/web3-util';

@injectable()
export class UnmarshalApi {
    @inject(IDS.NODE_MODULES.axios) _axios:Axios
    @inject(IDS.ORM.REPO.ContractDetailsRepo) _contractDetailsRepo:ContractDetailsRepo
    @inject(IDS.SERVICE.UnmarshalApiHelper) _helper: UnmarshalApiHelper
    @inject(IDS.CACHE.PriceCache) _priceCache: PriceCache
    @inject(IDS.ORM.REPO.ErrorLogRepo) _errorLogRepo: ErrorLogRepo
    @inject(IDS.SERVICE.WEB3.Web3Util) _web3Util: Web3Util

    _chain: ChainId

    chainName: string
    mainCoinId: string
    explorerUrl: string
    nativeCoinSymbol: string
    rpc: string

    initConfig(chain: ChainId){
        const config: any = getChainConf(chain);

        this._chain = chain;

        this.chainName = config.chainName;
        this.mainCoinId = config.nativeCoinId;
        this.explorerUrl = config.explorerUrl;
        this.nativeCoinSymbol = config.nativeCoinSymbol;
        this.rpc = config.rpc;
    }

    apiKey = envToString('UNMARSHAL_API_KEY');
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

    async getTokensFromApi(address: string) {
        const url = `${this.baseUrl}/v1/${this.chainName}/address/${address}/assets?auth_key=${this.apiKey}`
        const { data } = await this._axios.get(url).catch(err =>{
            this._errorLogRepo.log('unmarshal_get_address_tokens', err.message, `/v2/${this.chainName}/address/${address}/assets`)

            return Promise.reject(err)
        })
        if (!data?.length) {
            return [];
        }
        return data;
    }

    async getWalletTokens(address: string) {
        const data = await this.getTokensFromApi(address);

        const items = [this.getPageToken];
        for (const item of data) {
            const token = this.getTokenDataFromItem(item);
            items.push(token);
        }
        const tokens = items.filter(e => (e.balance || e.symbol === 'PAGE'));
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
            type: item.type,
            description: item.description,
            value,
            valueUSD: this._priceCache.getCoinPrice(this.mainCoinId) * value,
            tokenSymbol,
            tokenAmount,
            tokenAddress,
            hash: item.id,
            explorerUrl: this.explorerUrl + item.id,
            date: new Date(item.date * 1000)
        }
    }

    async getTransactionsFromApi(address: string, page, pageSize) {
        const url = `${this.baseUrl}/v2/${this.chainName}/address/${address}/transactions?page=${page}&pageSize=${pageSize}&auth_key=${this.apiKey}`;
        const { data } = await this._axios.get(url).catch(err =>{
            this._errorLogRepo.log('unmarshal_get_address_transactions', err.message, `/v2/${this.chainName}/address/${address}/transactions`)

            return Promise.reject(err)
        })

        if (data.transactions?.length == 0) {
            return { items: [], count: 0 };
        }

        return { items: data.transactions, count: data.total_txs };
    }

    async getTransactionsCount(address) {
        const url = `${this.baseUrl}/v2/${this.chainName}/address/${address}/transactions?page=1&pageSize=1&auth_key=${this.apiKey}`;
        const { data: { total_txs } } = await this._axios.get(url).catch(err =>{
            this._errorLogRepo.log('unmarshal_get_address_transactions_count', err.message, `/v2/${this.chainName}/address/${address}/transactions`)

            return Promise.reject(err)
        })

        return total_txs;
    }

    async getWalletAllTransactions(address: string, page, pageSize) {
        const { items, count } = await this.getTransactionsFromApi(address, page, pageSize);
        const transactions: any[] = [];
        for (const item of items) {
            const transaction = this.getTransactionDataFromItem(item);
            transactions.push(transaction);
        }
        return { count, transactions };
    }

    async getWalletTokenTransfers(address: string, page, pageSize) {
        try {
            const { transactions, count } = await this.getWalletAllTransactions(address, page, pageSize);
            const items = transactions.filter(e => e.title === 'Transfer');
            return { count, transactions: items };
        } catch {
            return { count: 0, transactions: [] };
        }
    }

    async getTransactionDetails(txHash) {
        const { data } = await this._axios.get(`${this.baseUrl}/v2/${this.chainName}/transactions/${txHash}?auth_key=${this.apiKey}`).catch(err =>{
            this._errorLogRepo.log('unmarshal_get_transaction_details', err.message, `/v2/${this.chainName}/transactions/${txHash}`)

            return Promise.reject(err)
        })

        const transfers = [...(data.sent || []), ...(data.other || []), ...(data.received || [])];
        const tranfersInfo = transfers.map(e => {
            return {
                from: e.from,
                to: e.to,
                symbol: e.symbol,
                name: e.name,
                logo: e.logo_url,
                amount: e.value / 10 ** e.decimals
            }
        });

        const value = data.value / 10 ** 18;
        const fee = data.fee / 10 ** 18;

        let action = data.description;
        if (data.type === 'swap') {
            const contractName = await this._contractDetailsRepo.getContractName(this._chain, data.to);
            action += ` on ${contractName}`;
        }
        if (data.type === 'approve') {
            const contract = await this._helper.getApproveTarget('ethereum', txHash);
            const contractName = await this._contractDetailsRepo.getContractName(this._chain, '0x' + contract);
            action += ` for trade on ${contractName}`;
        }

        return {
            txHash,
            block: data.block,
            date: new Date(data.date * 1000),
            nonce: data.nonce,
            status: this.txStatus[data.status],
            value,
            fee,
            valueUSD: this._priceCache.getCoinPrice(this.mainCoinId) * value,
            feeUSD: this._priceCache. getCoinPrice(this.mainCoinId) * value,
            transfers: tranfersInfo,
            action,
            logs: data.logDetails
        }
    }

    getNFTDataFromItem(item:IUnmarshanNftItem):INftItem {
        //const { url, type, name, price, description, attributes } = await this.getNFTDetailsFromApi(item.asset_contract, item.token_id);

        return {
            from: item.creator,
            to: item.owner,
            likes: 0,
            dislikes: 0,
            comments: [],
            date: new Date(),
            name: item.issuer_specific_data.name,
            collectionName: item.issuer_specific_data.name,
            description: item.description,
            type: item.type,
            usdPrice: Number(item.price),
            //contentUrl: normalizeUrl(item.external_link),
            contentUrl: normalizeUrl(item.issuer_specific_data.image_url),
            contract_address: item.asset_contract,
            tokenId: item.token_id,
            attributes: item.nft_metadata
        }
    }

    async getNFTTransactionDataFromItem(item) {
        /*const { name, symbol, date } = await this.getNFTDetailsFromBlockchain(item.contract_address, item.block_number);
        const { url, type, price, description, attributes } = await this.getNFTDetailsFromApi(item.contract_address, item.token_id);

        return {
            url,
            type,
            price,
            description,
            attributes,
            name,
            symbol,
            date,
            from: item.sender,
            to: item.to,
            txHash: item.transaction_hash,
            //date: new Date(),
            contract_address: item.contract_address || '',
            tokenId: item.token_id,
            likes: 0,
            dislikes: 0,
            comments: 0
        }*/
    }

    async getNFTDetailsFromApi(contractAddress, tokenId): Promise<UnmarshalNftDetails> {
        const apiUrl = `${this.baseUrl}/v2/${this.chainName}/address/${contractAddress}/details?page=1&pageSize=1&tokenId=${tokenId}&auth_key=${this.apiKey}`
        const { data } = await this._axios.get(apiUrl).catch(err =>{
            this._errorLogRepo.log('unmarshal_get_nft_details', err.message, `/v2/${this.chainName}/address/${contractAddress}/details`)

            return Promise.reject(err)
        })
        const info = data.nft_token_details[0];

        if(info.token_uri){
            const metadata = await this._web3Util.loadTokenMetadata(info.token_uri)
            
            return {
                url: normalizeUrl(metadata?.url),
                name: info.name || metadata?.name,
                price: info.price,
                description: info.description || metadata?.description,
                attributes: info.properties
            }
        }

        const url = normalizeUrl(info.image_url)

        return {
            url,
            name: info.name,
            price: info.price,
            description: info.description,
            attributes: info.properties
        }
    }

    async getNFTDetailsFromBlockchain(address, blockNumber) {
        /*const name = await this._helper.getFieldFromContract(this.rpc, address, 'name');
        const symbol = await this._helper.getFieldFromContract(this.rpc, address, 'symbol');
        const date = await this._helper.getDateFromBlock(this.rpc, blockNumber);
        return { symbol, name, date };*/
    }

    async getNFTTransactionsFromApi(address: string, page, pageSize):Promise<IUnmarshalNtfTxsResponse> {
        const url = `${this.baseUrl}/v2/${this.chainName}/address/${address}/nft-transactions?page=${page}&pageSize=${pageSize}&auth_key=${this.apiKey}`
        const { data } = await this._axios.get(url).catch(err =>{
            this._errorLogRepo.log('unmarshal_get_nft_transactions', err.message, `/v2/${this.chainName}/address/${address}/nft-transactions?page=${page}&pageSize=${pageSize}`)
            return Promise.reject(err)
        });
        return data;
    }

    async getNFTAssetsFromApi(address: string, page, pageSize):Promise<IUnmarshalNftResponse> {
        const url = `${this.baseUrl}/v2/${this.chainName}/address/${address}/nft-assets?page=${page}&pageSize=${pageSize}&auth_key=${this.apiKey}`
        const { data } = await this._axios.get(url).catch(err =>{
            this._errorLogRepo.log('unmarshal_get_nft_assets', err.message, `/v2/${this.chainName}/address/${address}/nft-assets?page=${page}&pageSize=${pageSize}`)

            return Promise.reject(err)
        })
        return data;
    }

    async getWalletAllNFTs(address: string, page, pageSize):Promise<INftsList> {
        const data = await this.getNFTAssetsFromApi(address, page, pageSize);

        const list = data.nft_assets?.map(i => this.getNFTDataFromItem(i)) || [];
        
        return { list, count: data.total_assets };
    }

    async getWalletNFTTransactions(address: string, page, pageSize) {
        const data = await this.getNFTTransactionsFromApi(address, page, pageSize);
        const transactions = data.transactions || [] 

        return { list: transactions, count: data.total_txs };
    }
}