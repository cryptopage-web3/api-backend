import { inject, injectable } from "inversify";
import { IDS } from '../types/index';
import { Axios } from 'axios';

@injectable()
export class PriceCache {
    @inject(IDS.NODE_MODULES.axios) _axios: Axios

    coins: {}

    async updateCoinsCache() {
        try {
            const { data } = await this._axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbinancecoin%2Cmatic-network%2Csolana%2Ctron&vs_currencies=usd');
            this.coins = data;
        } catch (err){
            console.log('Failed to load coins prices', err)
        }
    }

    getCoinPrice(id) {
        return this.coins[id]?.usd || 0;
    }
}

