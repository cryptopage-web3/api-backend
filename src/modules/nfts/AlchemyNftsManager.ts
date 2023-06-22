import { Alchemy, AssetTransfersCategory, AssetTransfersOrder, AssetTransfersWithMetadataResult, OwnedNft } from 'alchemy-sdk';
import { inject, injectable } from 'inversify';
import { IWeb3Manager } from '../../services/web3/types';
import { IDS } from '../../types';
import { ChainId } from '../transactions/types';
import { NftCache } from './NftCache';
import { INftsList, INftsManager, INftTransaction, INftPagination, NftTxType, Web3NftTokenData, INftItem } from './types';

@injectable()
export class AlchemyNftsManager implements INftsManager {
    _chain: ChainId;

    @inject(IDS.SERVICE.AlchemySdk) _alchemy:Alchemy
    @inject(IDS.SERVICE.WEB3.Web3Manager) private _web3Manager: IWeb3Manager
    @inject(IDS.MODULES.NftCache) _nftCache: NftCache

    async getWalletAllNFTs(address: string, opts: INftPagination): Promise<INftsList> {
        const addressNfts = await this._alchemy.nft.getNftsForOwner(address, {
            pageSize: opts.pageSize,
            pageKey: opts.pageKey
        })

        return {
            list: addressNfts.ownedNfts.map(n => this.buildNftData(n)),
            continue: {
                pageKey: addressNfts.pageKey
            },
            count: addressNfts.totalCount
        }
    }

    buildNftData(data:OwnedNft):INftItem {
        return {
            name: data.title,
            symbol: data.contract.symbol,
            description: data.description,
            contract_address: data.contract.address,
            tokenId: data.tokenId,
            collectionName: data.contract?.name,
            contentUrl: data.media?.[0]?.gateway,
            attributes: data.rawMetadata?.attributes as any[],
            likes: 0,
            dislikes: 0,
            comments:[],
            date: data.timeLastUpdated,
        }
    }

    async getWalletNFTTransactions(address: string, opts: INftPagination) {
        const response = await this._alchemy.core.getAssetTransfers({
            toAddress: address,
            order: AssetTransfersOrder.DESCENDING,
            category: [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155],
            withMetadata: true,
            maxCount: opts.pageSize,
            pageKey: opts.pageKey
        })

        return {
            transactions: response.transfers.map(i => this._normalizeNftTransactions(i)),
            continue: {
                pageKey: response.pageKey
            }
        }
    }

    _normalizeNftTransactions(data:AssetTransfersWithMetadataResult):INftTransaction {
        let tokenId: string = ''
        
        if(data.erc1155Metadata){
            tokenId = parseInt(data.erc1155Metadata[0].tokenId).toString()
        } else if(data.tokenId){
            tokenId = data.tokenId
        } else if(data.erc721TokenId){
            tokenId = data.erc721TokenId
        }

        return {
            type: NftTxType.baseInfo,
            txHash: data.hash,
            blockNumber: parseInt(data.blockNum),
            contract_address: data.rawContract.address || '',
            category: data.category,
            tokenId: tokenId,
            to: data.to || '',
            from: data.from,
        }
    }

    getNftTransactionDetails(contractAddress: string, tokenId: string, blockNumber: number | null, tokenCategory?: AssetTransfersCategory) {
        return this._nftCache.getNftTransactionDetails(
            this._web3Manager,
            this._chain,
            contractAddress,
            tokenId,
            blockNumber,
            ()=> this._getTokenData(contractAddress, tokenId)
        )
    }

    getNftDetails(contractAddress: string, tokenId: string, tokenCategory?: AssetTransfersCategory) {
        return this._nftCache.getNftTransactionDetails(
            this._web3Manager,
            this._chain,
            contractAddress,
            tokenId,
            null,
            ()=> this._getTokenData(contractAddress, tokenId)
        )
    }

    async _getTokenData(contractAddress: string, tokenId: string):Promise<Web3NftTokenData>{
        const nftMeta = await this._alchemy.nft.getNftMetadata(contractAddress, tokenId)

        const nftItem = {
            tokenId,
            contractAddress,
            contentUrl: nftMeta.media?.[0]?.gateway,
            name: nftMeta.title || nftMeta.contract.symbol || '',
            description: nftMeta.description || nftMeta.contract.name || '',
            attributes: nftMeta.rawMetadata?.attributes || [],
        }

        /*if(!nftItem.contentUrl){
            console.debug('try to load nft metadata from blockchain')
            const secondNftItem = await this._web3Manager.getTokenData(contractAddress, tokenId, tokenCategory)

            return secondNftItem;
        }*/

        return nftItem
    }
}