import { inject, injectable } from "inversify";
import { IDS } from "../../types";
import { Axios } from 'axios';
import { toUrlQueryParams } from '../../util/url-util';
import { ICoingeckoCoin } from "./types";

@injectable()
export class CoinGeckoApi {
    @inject(IDS.NODE_MODULES.axios) _axios: Axios
    async getCoinList():Promise<ICoingeckoCoin[]>{
        const url = this._buildUrl('/coins/list')
        
        const response = await this._axios.get(url)
        
        return response.data
    }

    async getMarkets(ids: string[]){
        const query = toUrlQueryParams({vs_currency:'usd', ids: ids.join(',')}),
            url = this._buildUrl(`/coins/markets?${query}`)
        
        const response = await this._axios.get(url)
        
        return response.data
    }

    _buildUrl(endpoint){
        return `https://api.coingecko.com/api/v3` + endpoint
    }
}