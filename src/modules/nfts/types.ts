import { ChainId } from '../transactions/types';

export interface INftsManager {
    _chain: ChainId
    
    getWalletAllNFTs(address: string, page: number, pageSize: number): Promise<INftsList>
    getWalletNFTTransactions(address: string, page: number, pageSize: number)
    getNftTransactionDetails(contractAddress: string, tokenId: string, blockNumber:number)
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

export enum NftTxType {
    baseInfo='base_info',
    image='image',
}

export interface INftTransaction {
    type: string
    price?: string
    url?: string
    description?: string
    attributes?: [{
        trait_type: string
        value: string
    }],
    name?: string
    symbol?: string
    date?: string
    from: string
    to: string
    txHash: string
    blockNumber: number
    contract_address: string
    tokenId: string
    likes?: number
    dislikes?: number
    comments?: number
}

export interface INftTxList {
    list: INftTransaction[]
    count: number
}

export interface NftTokenData {
    url: string,
    type: string,
    name: string,
    price: string,
    description: string,
    attributes: any[]
}

export type GetTokenFromApiCallback = () => Promise<NftTokenData>