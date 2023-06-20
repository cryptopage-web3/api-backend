import { Alchemy, TokenBalancesResponseErc20 } from "alchemy-sdk";
import { inject, injectable } from "inversify";
import { IDS } from "../../types";
import { IToken, ITokenManager, ITokensResponse } from "./types";

@injectable()
export class AlchemyTokenManager implements ITokenManager {
    @inject(IDS.SERVICE.AlchemySdk) _alchemy:Alchemy
    @inject(IDS.CONFIG.PageToken) _pageToken: IToken

    async getWalletTokens(address: string):Promise<ITokensResponse> {
        const addressTokens = await this._alchemy.core.getTokenBalances(address)

        const tokensWithbalances = await this._loadTokensMeta(addressTokens);

        if(this._hasPageToken(tokensWithbalances)){
            tokensWithbalances.unshift(this._pageToken)
        }

        return {
            tokens: tokensWithbalances
        }
    }

    async _loadTokensMeta(tokens:TokenBalancesResponseErc20):Promise<IToken[]>{
        let balances:IToken[] = [];

        const workers = tokens.tokenBalances.map(t => (new Promise<void>(async (resolve) =>{
            const meta = await this._alchemy.core.getTokenMetadata(t.contractAddress)

            balances.push({
                name: meta.name || '',
                symbol: meta.symbol || '',
                address: t.contractAddress,
                logo: meta.logo || '',
                balance: t.tokenBalance 
                    ? parseInt(t.tokenBalance)/Math.pow(10, meta.decimals || 0)
                    : 0,
                percentChange: 0,
                price: 0,
                balancePrice: 0
            })

            resolve()
        }))
        .catch(err => console.error('Failed to get erc20 token metadata from alchemy', err)))

        await Promise.all(workers)

        return balances
    }

    _hasPageToken(balances:IToken[]){
        return !!balances.find(t => t.address == this._pageToken.address)
    }
}