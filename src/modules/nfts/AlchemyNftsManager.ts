import { Alchemy, AssetTransfersCategory, AssetTransfersOrder, AssetTransfersWithMetadataResult, OwnedNft } from 'alchemy-sdk';
import BigNumber from 'bignumber.js';
import { inject, injectable } from 'inversify';
import { ICommunity } from '../../services/web3/social-smart-contract/types';
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
    @inject(IDS.SERVICE.CryptoPageCommunity) _community: ICommunity

    async getWalletAllNFTs(address: string, opts: INftPagination): Promise<INftsList> {
        const addressNfts = await this._alchemy.nft.getNftsForOwner(address, {
            pageSize: opts.pageSize,
            pageKey: opts.pageKey
        })

        const list = await Promise.all(addressNfts.ownedNfts.map(n => this.buildNftData(n)))

        return {
            list,
            continue: {
                pageKey: addressNfts.pageKey
            },
            count: addressNfts.totalCount
        }
    }

    async buildNftData(data:OwnedNft):Promise<INftItem> {
        const tokenId = data.tokenId ? BigNumber(data.tokenId).toString() : '',
            comments = await this._community.getComments(data.contract.address, tokenId).catch(err => [])

        return {
            name: data.title,
            symbol: data.contract.symbol,
            description: data.description,
            contract_address: data.contract.address,
            tokenId: data.tokenId,
            collectionName: data.contract?.name,
            contentUrl: data.media?.[0]?.raw || data.media?.[0]?.gateway,
            attributes: data.rawMetadata?.attributes as any[],
            likes: 0,
            dislikes: 0,
            comments,
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

        const transactions = await Promise.all(response.transfers.map(i => this._normalizeNftTransactions(i)))

        return {
            transactions,
            continue: {
                pageKey: response.pageKey
            }
        }
    }

    async _normalizeNftTransactions(data:AssetTransfersWithMetadataResult):Promise<INftTransaction> {
        let tokenId: string = ''
        
        if(data.erc1155Metadata){
            tokenId = data.erc1155Metadata[0].tokenId
        } else if(data.tokenId){
            tokenId = data.tokenId
        } else if(data.erc721TokenId){
            tokenId = data.erc721TokenId
        }

        tokenId = tokenId ? BigNumber(tokenId).toString() : ''

        const contractAddress = data.rawContract.address || ''/*,
            comments = await this._community.getComments(contractAddress, tokenId)*/

        return {
            type: NftTxType.baseInfo,
            txHash: data.hash,
            blockNumber: parseInt(data.blockNum),
            contract_address: contractAddress,
            category: data.category,
            tokenId,
            to: data.to || '',
            from: data.from
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
            contentUrl: nftMeta.media?.[0]?.raw || nftMeta.media?.[0]?.gateway,
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