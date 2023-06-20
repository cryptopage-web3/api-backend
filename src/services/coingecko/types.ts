export interface ICoingeckoCoin {
    id: string
    symbol: string
    name: string
}

export type CoingeckoCoinMap = {
    [key:string]: ICoingeckoCoin
}