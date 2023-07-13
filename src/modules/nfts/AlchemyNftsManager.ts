import { Alchemy, AssetTransfersCategory, AssetTransfersOrder, AssetTransfersWithMetadataResult, OwnedNft } from 'alchemy-sdk';
import BigNumber from 'bignumber.js';
import { inject, injectable } from 'inversify';
import { ICommunity } from '../../services/web3/social-smart-contract/types';
import { IWeb3Manager } from '../../services/web3/types';
import { IDS } from '../../types';
import { IToken } from '../tokens/types';
import { ChainId } from '../transactions/types';
import { NftCache } from './NftCache';
import { INftsList, INftsManager, INftTransaction, INftPagination, NftTxType, Web3NftTokenData, INftItem } from './types';
import { Web3Util } from '../../services/web3/web3-util';
import { normalizeUrl } from '../../util/url-util';

@injectable()
export class AlchemyNftsManager implements INftsManager {
    _chain: ChainId;

    @inject(IDS.SERVICE.AlchemySdk) _alchemy:Alchemy
    @inject(IDS.SERVICE.WEB3.Web3Manager) private _web3Manager: IWeb3Manager
    @inject(IDS.MODULES.NftCache) _nftCache: NftCache
    @inject(IDS.SERVICE.CryptoPageCommunity) _community: ICommunity
    @inject(IDS.CONFIG.PageToken) _pageToken: IToken
    @inject(IDS.SERVICE.WEB3.Web3Util) _web3Util: Web3Util

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
            contentUrl: normalizeUrl(data.media?.[0]?.raw || data.media?.[0]?.gateway),
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
        const alchemyResponse = await this._alchemy.nft.getNftMetadata(contractAddress, tokenId)

        const nftItem = {
            tokenId,
            contractAddress,
            contentUrl: normalizeUrl(alchemyResponse.media?.[0]?.raw || alchemyResponse.media?.[0]?.gateway),
            name: alchemyResponse.title || alchemyResponse.contract.symbol || '',
            description: alchemyResponse.description || alchemyResponse.contract.name || '',
            attributes: alchemyResponse.rawMetadata?.attributes || [],
        }

        if(!nftItem.contentUrl && alchemyResponse.tokenUri?.raw && contractAddress == this._pageToken.address){
            const [meta, post] = await Promise.all([
                this._web3Util.loadTokenMetadata(alchemyResponse.tokenUri?.raw),
                this._community.readPostForContract(contractAddress, tokenId)
            ])
            nftItem.contentUrl = normalizeUrl(meta?.contentUrl)
            nftItem.description = meta?.description
            const {
                isEncrypted,payAmount,accessDuration, commentCount, upCount, downCount
            } = post

            return Object.assign({}, nftItem, {isEncrypted,payAmount,accessDuration, commentCount, upCount, downCount}) as Web3NftTokenData
        }

        return nftItem
    }
}