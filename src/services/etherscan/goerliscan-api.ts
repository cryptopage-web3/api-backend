import { inject, injectable } from 'inversify';
import { getEthBalance, getBalanceOfToken, getTransactionCount, getTokenMetadata, getTransactionData } from './web3';
import { IDS } from '../../types/index';
import { Axios, AxiosResponse } from 'axios';
import { IGoerliNftTransaction, IGoerliTransaction } from './types';

const API_URL = `https://api-goerli.etherscan.io/api`;

@injectable()
export class GoerliScanApi {
    @inject(IDS.NODE_MODULES.axios) _axios:Axios
    @inject(IDS.CONFIG.GoerliApiKey) _apiKey:string
    
    async setBalanceToToken(token, address, tokenAddress, decimals) {
        try {
            const balance = await getBalanceOfToken(address, tokenAddress, decimals);
            token.balance = balance;
        } catch (err) { }
    }

    async getWalletTokens(address) {

        // eth
        const ethBalance = await getEthBalance(address);
        const eth = {
            name: 'Ethereum',
            symbol: 'GoerliETH',
            address,
            decimals: '18',
            balance: ethBalance
        };

        // tokens
        const tokens: any = await this.getTokensUsedByAddress(address);
        const promises: any = [];
        for (let i = 0; i < tokens.length; i++) {
            promises.push(this.setBalanceToToken(tokens[i], address, tokens[i].address, tokens[i].decimals));
        }
        await Promise.all(promises);
        tokens.unshift(eth);
        return tokens.filter(e => e.balance);
    }

    async getTokensUsedByAddress(address) {
        const response = await this._axios.get(`${API_URL}?module=account&action=tokentx&address=${address}&page=1&offset=100&startblock=0&endblock=999999999999999999999&sort=asc&apikey=${this._apiKey}`);
        
        this._validateResponse(response)

        const addresses = {};

        for (const item of response.data.result) {
            addresses[item.contractAddress] = {
                address: item.contractAddress,
                name: item.tokenName,
                symbol: item.tokenSymbol,
                decimals: item.tokenDecimal
            };
        }
        return Object.values(addresses);
    }

    async getWalletAllTransactions(address: string, page: number, pageSize: number):Promise<IGoerliTransaction[]> {
        const url = `${API_URL}?module=account&action=txlist&address=${address}&page=${page}&offset=${pageSize}&startblock=0&endblock=999999999999999999999&sort=desc&apikey=${this._apiKey}`
        const response = await this._axios.get(url);
        
        this._validateResponse(response)

        return response.data.result
    }

    async getNftTransactionsByAddress(address: string, page: number, pageSize: number):Promise<IGoerliNftTransaction[]> {
        const url = `${API_URL}?module=account&action=tokennfttx&address=${address}&page=${page}&offset=${pageSize}&startblock=0&endblock=99999999&sort=desc&apikey=${this._apiKey}`
        const response = await this._axios.get(url);
        
        this._validateResponse(response)

        return response.data.result;
    }

    _validateResponse(response:AxiosResponse<any,any>){
        if(response.data.status == '0' && response.data.message === 'NOTOK'){
            throw new Error('Failed to call goerli api: ' + response.data.result)
        }
    }

    async getTokenTransfers(address: string, pageSize: number) {
        const response = await this._axios.get(`${API_URL}?module=account&action=tokentx&address=${address}&page=1&offset=${pageSize || 10}&startblock=0&endblock=99999999&sort=desc&apikey=${this._apiKey}`);

        this._validateResponse(response)

        const list: any = [];
        for (let i = 0; i < response.data.result.length; i++) {
            const data = response.data.result[i];
            const item: any = {
                name: data.tokenName,
                from: data.from,
                to: data.to,
                fee: data.gasPrice * data.gasUsed / 10 ** 18,
                value: data.value,
                tokenSymbol: data.tokenSymbol,
                tokenAmount: data.value / 10 ** data.tokenDecimal,
                tokenAddress: data.contractAddress,
                hash: data.hash,
                explorerUrl: data.hash,
                date: new Date(data.timeStamp * 1000)
            }
            list.push(item);
        }
        return {
            transactions: list, count: list.length
        }
    }

    getTransactionDetails(txHash) {
        return getTransactionData(txHash);
    }

}