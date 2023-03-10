import * as helper from './helper'

export interface IUnmarshanNftItem {
    asset_contract: string
    token_id: string
    owner: string
    external_link: string
    type: string
    balance: number
    nft_metadata: any[]
    issuer_specific_data:{
        entire_response: string,
        image_url: string
        name: string
    }
    price: string
    description: string
    creator: string
}

export interface IUnmarshalNftResponse {
    items_on_page: number
    next_offset: number
    total_assets: number
    nft_assets: IUnmarshanNftItem[]
}

export interface UnmarshalNftDetails {
    url: string
    name: string
    price: string
    description: string
    attributes: any[]
}

export interface IUnmarshalNftTransaction {
    contract_address: string
    token_id: string
    transaction_hash: string
    block_number: number
    block_hash: string
    transaction_idx: number
    log_idx: number
    sender: string
    to: string
    type: string
    creator: string
}

export interface IUnmarshalNtfTxsResponse {
    transactions: IUnmarshalNftTransaction[]
    total_txs: number
}