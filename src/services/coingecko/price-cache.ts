import { inject, injectable } from "inversify";
import { IDS } from "../../types";
import { safeStart } from "../../util/safe-start";
import { CoinGeckoApi } from "./coingecko-api";
import { CoingeckoCoinMap, ICoingeckoCoin, ICoingeckoMarketMap, IPriceInfoMap } from "./types";

@injectable()
export class CoingeckoPriceCache {
    _idsMap: CoingeckoCoinMap
    _idLoadPromise: Promise<ICoingeckoCoin[]>
    _marketsMap: ICoingeckoMarketMap = {}
    @inject(IDS.CONFIG.COINGECKO_PRICE_CACHE_TTL_IN_SECONDS) _cacheTtl: number

    @inject(IDS.SERVICE.CoingeckoApi) _api: CoinGeckoApi

    async getPriceInfo(coins:string[]){
        const price: IPriceInfoMap = {}
        const coinsWithoutPrice:string[] = [];

        coins.forEach(c => {
            if(!this._marketsMap[c]){
                coinsWithoutPrice.push(c)
            } else {
                price[c] = this._marketsMap[c].market
            }
        })

        if(coinsWithoutPrice.length > 0){
            await this.loadPrice(coinsWithoutPrice)
        }

        coinsWithoutPrice.forEach(c => {
            if(this._marketsMap[c]){
                price[c] = this._marketsMap[c].market
            }
        })

        return price;
    }

    async loadIds(){
        if(!this._idLoadPromise){
            this._idLoadPromise = this._api.getCoinList()
        }

        const coins = await this._idLoadPromise,
            newIdsMap = {};

        coins.forEach(c=>{
            newIdsMap[c.symbol] = c;
        })

        this._idsMap = newIdsMap
    }

    async loadPrice(coins:string[]){
        const ids = await this._getIds(coins)
        
        if(ids.length == 0){
            return
        }

        const markets = await this._api.getMarkets(ids)
        const ts = new Date()

        markets.forEach(m =>{
            this._marketsMap[m.symbol] = { market: m, ts}
        })
    }

    async _getIds(coins: string[]){
        if(!this._idsMap){
            await this.loadIds()
        }

        return this.mapIds(this._idsMap, coins)
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

    _cleanOldPrice(){
        const nowTs = Date.now()

        Object.keys(this._marketsMap).forEach(m =>{
            const diffInSeconds = (nowTs - this._marketsMap[m].ts.getTime()) / 1000
            if(diffInSeconds > this._cacheTtl){
                delete this._marketsMap[m]

                console.log(m, 'removed from price cache')
            }
        })
    }

    startPriceCleaner(){
        safeStart(()=>{
            return this._cleanOldPrice()
        }, { intervalInSeconds: 60, descr: 'coingecko_price_cache_cleaner' })
    }
}