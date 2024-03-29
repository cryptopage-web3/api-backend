import { INftsManager, INftsList, INftTransaction, NftTxType, INftPagination } from './types';
import { UnmarshalApi } from '../../services/unmarshal/UnmarhalApi';
import { inject, injectable } from 'inversify';
import { IDS, ApiError } from '../../types/index';
import { ChainId } from '../transactions/types';
import { IWeb3Manager } from '../../services/web3/types';
import { IUnmarshalNftTransaction } from '../../services/unmarshal/types';
import { NftCache } from './NftCache';

@injectable()
export class UnmarshalNftsManager implements INftsManager {
    _unmarshalApi: UnmarshalApi
    _chain: ChainId
    
    constructor(
        @inject(IDS.SERVICE.UnmarshalApi) unmarshalApi: UnmarshalApi,
    ){
        this._unmarshalApi = unmarshalApi
    }

    getWalletAllNFTs(address, {page, pageSize}):Promise<INftsList> {
        return this._unmarshalApi.getWalletAllNFTs(address, page, pageSize);
    }
    
    async getWalletNFTTransactions(address, opts:INftPagination) {
        const { list, count } = await this._unmarshalApi.getWalletNFTTransactions(address, opts.page, opts.pageSize);

        return {
            list: list.map(t => this._normalizeNftTransactions(t)),
            count
        }
    }

    _normalizeNftTransactions(data:IUnmarshalNftTransaction):INftTransaction {
        return {
            type: NftTxType.baseInfo,
            txHash: data.transaction_hash,
            blockNumber: data.block_number,
            contractAddress: data.contract_address,
            tokenId: data.token_id,
            to: data.to,
            from: data.sender,
        }
    }
/*
    async getNftTransactionDetails(contractAddress: string, tokenId: string, blockNumber:number) {
        return this._nftCache.getNftTransactionDetails(
            this._web3Manager,
            this._chain,
            contractAddress, 
            tokenId, 
            blockNumber,
            () => this._unmarshalApi.getNFTDetailsFromApi(contractAddress, tokenId)
        )
    }*/

    async getNftDetails(contractAddress: string, tokenId: string) {
        return this._unmarshalApi.getNFTDetailsFromApi(contractAddress, tokenId)
    }
}