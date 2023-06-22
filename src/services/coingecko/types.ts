export interface ICoingeckoCoin {
    id: string
    symbol: string
    name: string
}

export type CoingeckoCoinMap = {
    [key:string]: ICoingeckoCoin
}

export interface ICoingeckoMarket {
    id: string
    symbol: string
    name: string
    image: string
    current_price: number
    market_cap_rank: number
    price_change_24h: number
    price_change_percentage_24h: number
}

export type ICoingeckoMarketMap = {
    [key:string]: {
        market: ICoingeckoMarket
        ts: Date
    }
}

export interface IPriceInfoMap {
    [key: string]: ICoingeckoMarket
}