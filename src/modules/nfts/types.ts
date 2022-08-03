export interface INftsManager {
    getWalletAllNFTs(address: string, page: number, pageSize: number)
    getWalletNFTTransactions(address: string, page: number, pageSize: number)
}