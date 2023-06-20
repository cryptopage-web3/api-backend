import { inject, injectable } from "inversify";
import { IDS } from "../../types";
import { CoinGeckoApi } from "./coingecko-api";
import { CoingeckoCoinMap, ICoingeckoCoin } from "./types";

@injectable()
export class CoingeckoPriceCache {
    _idsMap: CoingeckoCoinMap
    _idLoadPromise: Promise<ICoingeckoCoin[]>

    @inject(IDS.SERVICE.CoingeckoApi) _api: CoinGeckoApi

    async loadIds(){
        if(!this._idLoadPromise){
            this._idLoadPromise = this._api.getCoinList()
        }

        const coins = await this._idLoadPromise;

        coins.forEach(c=>{
            this._idsMap[c.symbol] = c;
        })
    }

    async loadPrice(coins){

    }

    async _getIds(coins: string[], callback){
        if(this._idsMap){
            callback(this.mapIds(this._idsMap, coins))
        }
    }

    mapIds(map:CoingeckoCoinMap, coins: string[]){
        const ids:string[] = [];

        coins.forEach(c =>{
            const symbol = c.toLowerCase()
            if(map[symbol]){
                ids.push(map[symbol].id)
            }
        })

        return ids;
    }
}