export enum ChainId {
    eth='eth',
    bsc='bsc',
    matic='matic',
    sol='sol',
    tron='tron'
}

export interface ITransactionManager {
    getWalletAllTransactions(address:string, skip:number, limit: number): Promise<{transactions: any[], count:number}>
    getTransactionDetails(txHash:string)
    getWalletTokenTransfers(address:string, skip:number, limit:number)
}