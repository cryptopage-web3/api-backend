export interface ITronTransaction {
    title: string,
    from: string,
    to: string,
    fee: number,
    value: number,
    valueUSD: number,
    hash: string,
    explorerUrl: string,
    tokenSymbol: string,
    date: Date
}