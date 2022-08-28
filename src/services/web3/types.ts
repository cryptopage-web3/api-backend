export interface IWeb3Manager {
    getDateFromBlock(blocknum: number): Promise<Date>
    getFieldFromContract(address: string, key: string)
}