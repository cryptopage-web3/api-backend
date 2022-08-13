import axios  from 'axios';
import { getEthBalance, getBalanceOfToken }  from './web3';

const API_URL = `https://api-goerli.etherscan.io/api`;

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

}