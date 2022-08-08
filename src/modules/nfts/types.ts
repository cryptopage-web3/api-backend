export interface INftsManager {
    getWalletAllNFTs(address: string, page: number, pageSize: number): Promise<INftsList>
    getWalletNFTTransactions(address: string, page: number, pageSize: number)
}

export interface INftItem {
    from: string,
    to: string,
    likes: number,
    dislikes: number,
    comments: number,
    date: Date,
    name: string,
    collectionName: string,
    description: string,
    type: string,
    usdPrice: number,
    url: string,
    image: string,
    contract_address: string,
    tokenId: string,
    attributes: any[]
}

export interface INftsList {
    list: INftItem[],
    count: number
}