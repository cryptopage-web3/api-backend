import { Alchemy, TokenBalancesResponseErc20 } from "alchemy-sdk";
import { inject, injectable } from "inversify";
import { IDS } from "../../types";
import { ITokenManager } from "./types";

@injectable()
export class AlchemyTokenManager implements ITokenManager {
    @inject(IDS.SERVICE.AlchemySdk) _alchemy:Alchemy

    async getWalletTokens(address: string) {
        const addressTokens = await this._alchemy.core.getTokenBalances(address)

        const tokensWithbalances = await this._loadTokensMeta(addressTokens);

        return {
            tokens: tokensWithbalances
        }
    }

    async _loadTokensMeta(tokens:TokenBalancesResponseErc20){
        let balances:any[] = [];

        const workers = tokens.tokenBalances.map(t => (new Promise<void>(async (resolve) =>{
            const meta = await this._alchemy.core.getTokenMetadata(t.contractAddress)

            balances.push({
                name: meta.name,
                symbol: meta.symbol,
                address: t.contractAddress,
                logo: meta.logo,
                balance: t.tokenBalance 
                    ? parseInt(t.tokenBalance)/Math.pow(10, meta.decimals || 0)
                    : 0
            })

            resolve()
        }))
        .catch(err => console.error('Failed to get erc20 token metadata from alchemy', err)))

        await Promise.all(workers)

        return balances
    }
}