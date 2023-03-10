import { ChainId } from '../transactions/types';
import { ISocialComment } from '../../services/web3/social-smart-contract/types';

export interface INftsManager {
    _chain: ChainId
    
    getWalletAllNFTs(address: string, page: number, pageSize: number): Promise<INftsList>
    getWalletNFTTransactions(address: string, opts: INftTransactionsPagination)
    getNftTransactionDetails(contractAddress: string, tokenId: string, blockNumber:number | null)
    getNftDetails(contractAddress: string, tokenId: string)
}

export interface INftTransactionsPagination {
    pageSize: number
    page?:number,
    pageKey?: string
}

export interface INftItem {
    likes: number,
    dislikes: number,
    comments: ISocialComment[],
    date: string | Date,
    name: string,
    symbol?: string
    collectionName?: string,
    description: string,
    type?: string,
    usdPrice?: number,
    contentUrl: string | undefined,
    image?: string,
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
    fullInfo='full_info',
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
    comments?: ISocialComment[]
}

export interface INftTxList {
    list: INftTransaction[]
    count: number
}

export interface Web3NftTokenData {
    url: string,
    name: string,
    price: string,
    description: string,
    attributes: any[],
    isEncrypted?: boolean,
    accessPrice?: string,
    accessDuration?: string
}

export type GetTokenFromApiCallback = () => Promise<Web3NftTokenData>