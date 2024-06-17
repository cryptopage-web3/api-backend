import { Alchemy, AssetTransfersCategory, AssetTransfersOrder, AssetTransfersWithMetadataResult, OwnedNft } from 'alchemy-sdk';
import BigNumber from 'bignumber.js';
import { inject, injectable } from 'inversify';
import { ICommunity, ISocialComment } from '../../services/web3/social-smart-contract/types';
import { IDS } from '../../types';
import { ChainId } from '../transactions/types';
import { INftsList, INftsManager, INftTransaction, INftPagination, NftTxType, Web3NftTokenData, INftItem } from './types';
import { Web3Util } from '../../services/web3/web3-util';
import { normalizeUrl } from '../../util/url-util';
import { ErrorLogRepo } from '../../orm/repo/error-log-repo';
import { IChainConf } from '../../services/web3/social-smart-contract/constants';
import { isEqAddr } from '../../util/string-util';

@injectable()
export class AlchemyNftsManager implements INftsManager {
    _chain: ChainId;

    @inject(IDS.SERVICE.AlchemySdk) _alchemy:Alchemy
    @inject(IDS.SERVICE.CryptoPageCommunity) _community: ICommunity
    @inject(IDS.SERVICE.WEB3.Web3Util) _web3Util: Web3Util
    @inject(IDS.ORM.REPO.ErrorLogRepo) _errorRepo: ErrorLogRepo
    @inject(IDS.CONFIG.SmartContractsConf) _smConf: IChainConf

    async getWalletAllNFTs(address: string, opts: INftPagination): Promise<INftsList> {
        const addressNfts = await this._alchemy.nft.getNftsForOwner(address, {
            contractAddresses: [this._smConf.cryptoPageNftContractAddress],
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
        const tokenId = data.tokenId ? BigNumber(data.tokenId).toString() : ''

        const nftItem = {
            name: data.title,
            symbol: data.contract.symbol,
            description: data.description,
            contractAddress: data.contract.address,
            tokenId: data.tokenId,
            collectionName: data.contract?.name,
            contentUrl: normalizeUrl(data.media?.[0]?.raw || data.media?.[0]?.gateway),
            attributes: data.rawMetadata?.attributes as any[],
            date: data.timeLastUpdated,
            comments: [] as ISocialComment[]
        }

        const [comments, post] = await Promise.all([
            await this._community.getComments(data.contract.address, tokenId).catch(err => []),
            await this._community.readPostForContract(data.contract.address, tokenId),
            this._updateCryptoPageMeta(nftItem, data.tokenUri?.raw).catch(err => null)
        ])

        return Object.assign({}, nftItem, {comments}, post)
    }

    async getWalletNFTTransactions(address: string, opts: INftPagination) {
        const response = await this._alchemy.core.getAssetTransfers({
            toAddress: address,
            order: AssetTransfersOrder.DESCENDING,
            category: [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155],
            contractAddresses:[this._smConf.cryptoPageNftContractAddress],
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
            contractAddress: contractAddress,
            category: data.category,
            tokenId,
            to: data.to || '',
            from: data.from
        }
    }

    async getNftDetails(contractAddress: string, tokenId: string):Promise<Web3NftTokenData>{
        const alchemyResponse = await this._alchemy.nft.getNftMetadata(contractAddress, tokenId)

        const nftItem = {
            tokenId,
            contractAddress,
            contentUrl: normalizeUrl(alchemyResponse.media?.[0]?.raw || alchemyResponse.media?.[0]?.gateway),
            name: alchemyResponse.title || '',
            description: alchemyResponse.description || '',
            attributes: alchemyResponse.rawMetadata?.attributes || [],
            attachments: undefined
        }

        if(isEqAddr( contractAddress, this._smConf.cryptoPageNftContractAddress)){
            const [post] = await Promise.all([
                this._community.readPostForContract(contractAddress, tokenId),
                this._updateCryptoPageMeta(nftItem, alchemyResponse.tokenUri?.raw)
            ])

            return Object.assign({}, nftItem, post)
        }

        return nftItem
    }

    async _updateCryptoPageMeta(nftItem:Web3NftTokenData, tokenUri:string | undefined){
        if(!isEqAddr(nftItem.contractAddress, this._smConf.cryptoPageNftContractAddress) || !tokenUri){
            return
        }

        const meta = await this._web3Util.loadTokenMetadata(tokenUri).catch(err =>{
            this._errorRepo.log('load_crypto_page_meta', err.message, {
                tokenId: nftItem.tokenId,
                tokenUri
            })
        })

        nftItem.contentUrl = normalizeUrl(meta?.contentUrl) || nftItem.contentUrl
        nftItem.name = meta?.name || nftItem.name || ''
        nftItem.attachments = meta?.attachments
        nftItem.description = meta?.description
        nftItem.attributes = meta?.attributes
    }
}