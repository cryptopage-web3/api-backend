import { inject, injectable } from "inversify";
import { INftsManager, INftsList, INftTransaction, NftTxType, INftItem, INftTransactionsPagination } from './types';
import { GoerliScanApi } from './../../services/etherscan/goerliscan-api';
import { ChainId } from "modules/transactions/types";
import { IDS } from '../../types/index';
import { IGoerliNftTransaction } from '../../services/etherscan/types';
import { IWeb3Manager } from '../../services/web3/types';
import { NftCache } from './NftCache';
import { ISocialSmartContract } from '../../services/social-smart-contract/types';
import { Alchemy, AssetTransfersCategory, AssetTransfersWithMetadataResult, OwnedNft } from 'alchemy-sdk';

@injectable()
export class GoerliScanNFTsManager implements INftsManager {
    @inject(IDS.SERVICE.GoerliScanApi) _goerli:GoerliScanApi
    @inject(IDS.SERVICE.WEB3.Web3Manager) private _web3Manager: IWeb3Manager
    @inject(IDS.SERVICE.SocialSmartContract) private _socialSmartContract: ISocialSmartContract
    @inject(IDS.MODULES.NftCache) _nftCache: NftCache
    @inject(IDS.SERVICE.AlchemySdk) _alchemy:Alchemy

    _chain: ChainId;

    async getWalletAllNFTs(address, page, pageSize):Promise<INftsList> {
        const response = await this._alchemy.nft.getNftsForOwner(address, {pageSize: 100})
        
        const list: any[] = [];

        for (let i = 0; i < response.ownedNfts.length; i++) {
            list.push( await this.buildNftData(response.ownedNfts[i]))
        }

        return { list, count: response.totalCount }
    }
    
    async buildNftData(data:OwnedNft):Promise<INftItem> {
        const comments = await this._socialSmartContract.getComments(data.tokenId)

        return {
            name: data.title,
            symbol: data.contract.symbol,
            description: data.description,
            contract_address: data.contract.address,
            tokenId: data.tokenId,
            collectionName: data.contract?.name,
            url: data.media[0]?.gateway,
            attributes: data.rawMetadata?.attributes as any[],
            likes: 0,
            dislikes: 0,
            comments,
            date: data.timeLastUpdated,
        }
    }
    
    /*async nftAsyncResolver(data: IGoerliNftTransaction) {
        const metadata = await this._web3Manager.getTokenData(data.contractAddress, data.tokenID)
        const comments = await this._socialSmartContract.getComments(data.tokenID)
        const item = {
            from: data.from,
            to: data.to,
            likes: 0,
            dislikes: 0,
            comments,
            date: new Date( parseInt(data.timeStamp) * 1000),
            name: data.tokenName,
            collectionName: data.tokenName,
            symbol: data.tokenSymbol,
            type: metadata?.type || '721',
            usdPrice: 0,
            txHash: data.hash,
            contract_address: data.contractAddress,
            tokenId: data.tokenID,
            description: metadata.description,
            url: metadata.url,
            //image: metadata.url,
            attributes: metadata.attributes
        }
        return item;
    }*/

    async getWalletNFTTransactions(address: string, opts: INftTransactionsPagination) {
        const response = await this._alchemy.core.getAssetTransfers({
            toAddress: address,
            category: [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155],
            withMetadata: true,
            maxCount: opts.pageSize,
            pageKey: opts.pageKey
        })
        //const list = await this._goerli.getNftTransactionsByAddress(address, page, pageSize);
        return { 
            list:response.transfers.map(t => this._normalizeNftTransaction(t))
        };
    }

    _normalizeNftTransaction(data:AssetTransfersWithMetadataResult):INftTransaction{
        const tokenId = data.tokenId || data.erc1155Metadata?.[0].tokenId
        
        return {
            type: NftTxType.baseInfo,
            txHash: data.hash,
            blockNumber: parseInt(data.blockNum, 16),
            contract_address: data.rawContract.address as string,
            tokenId: parseInt(tokenId as string, 16).toString(),
            to: data.to as string,
            from: data.from
        }
    }

    getNftTransactionDetails(contractAddress: string, tokenId: string, blockNumber: number) {
        return this._nftCache.getNftTransactionDetails(
            this._web3Manager,
            this._chain,
            contractAddress,
            tokenId,
            blockNumber,
            ()=> this._web3Manager.getTokenData(contractAddress, tokenId)
        )
    }
}