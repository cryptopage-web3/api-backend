import { injectable } from 'inversify';
import axios from 'axios';
import { getEthBalance, getBalanceOfToken, getTransactionCount, getTokenMetadata } from './web3';

const API_URL = `https://api-goerli.etherscan.io/api`;

@injectable()
export class GoerliScanApi {

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
        const { data: { result } } = await axios.get(`${API_URL}?module=account&action=tokentx&address=${address}&page=1&offset=100&startblock=0&endblock=999999999999999999999&sort=asc&apikey=YourApiKeyToken`);
        const addresses = {};
        for (const item of result) {
            addresses[item.contractAddress] = {
                address: item.contractAddress,
                name: item.tokenName,
                symbol: item.tokenSymbol,
                decimals: item.tokenDecimal
            };
        }
        return Object.values(addresses);
    }

    async getWalletAllTransactions(address: string, pageSize: number, beforeHash?: string) {
        const { data: { result } } = await axios.get(`${API_URL}?module=account&action=txlist&address=${address}&page=1&offset=${pageSize || 10}&startblock=0&endblock=999999999999999999999&sort=asc&apikey=YourApiKeyToken`);
        const txCount = await getTransactionCount(address);
        return {
            count: txCount,
            transactions: result,
            beforeHash
        };
    }

    async getNftTransactionsByAddress(address) {
        const { data: { result } } = await axios.get(`${API_URL}?module=account&action=tokennfttx&address=${address}&page=1&offset=100&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken`);
        return result;
    }

    async nftAsyncResolver(data: any) {
        const metadata = await getTokenMetadata(data.contractAddress, data.tokenID)
        const item = {
            from: data.from,
            to: data.to,
            likes: 0,
            dislikes: 0,
            comments: 0,
            date: new Date(data.timeStamp * 1000),
            name: data.tokenName,
            collectionName: data.tokenName,
            symbol: data.tokenSymbol,
            type: data.type || '721',
            usdPrice: 0,
            txHash: data.hash,
            contract_address: data.contractAddress,
            tokenId: data.tokenID,
            description: metadata.description,
            url: metadata.image,
            image: metadata.image,
            attributes: metadata.attributes
        }
        return item;
    }

    async getNftTransfers(address: string) {
        const nfts = await this.getNftTransactionsByAddress(address);
        const promises: any = [];
        for (let i = 0; i < nfts.length; i++) {
            promises.push(this.nftAsyncResolver(nfts[i]));
        }
        const list = await Promise.all(promises);
        return list;
    }

    async getTokenTransfers(address: string, pageSize: number, beforeHash?: string) {
        const { data: { result } } = await axios.get(`${API_URL}?module=account&action=tokentx&address=${address}&page=1&offset=${pageSize || 10}&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken`);
        const list: any = [];
        for (let i = 0; i < result.length; i++) {
            const data = result[i];
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

}