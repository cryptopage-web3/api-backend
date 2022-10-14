import { inject, injectable } from "inversify";
import { INftsManager, INftsList, INftTransaction, NftTxType } from './types';
import { GoerliScanApi } from './../../services/etherscan/goerliscan-api';
import { ChainId } from "modules/transactions/types";
import { IDS } from '../../types/index';
import { IGoerliNftTransaction } from '../../services/etherscan/types';
import { IWeb3Manager } from '../../services/web3/types';
import { NftCache } from './NftCache';
import { ISocialSmartContract } from '../../services/social-smart-contract/types';

@injectable()
export class GoerliScanNFTsManager implements INftsManager {
    @inject(IDS.SERVICE.GoerliScanApi) _goerli:GoerliScanApi
    @inject(IDS.SERVICE.WEB3.Web3Manager) private _web3Manager: IWeb3Manager
    @inject(IDS.SERVICE.SocialSmartContract) private _socialSmartContract: ISocialSmartContract
    @inject(IDS.MODULES.NftCache) _nftCache: NftCache

    _chain: ChainId;

    async getWalletAllNFTs(address, page, pageSize):Promise<INftsList> {
        const txs = await this._goerli.getNftTransactionsByAddress(address,1,100)
        const nfts = txs.filter(e => e.to.toLowerCase() === address.toLowerCase());

        const list: any[] = [];

        for (let i = 0; i < nfts.length; i++) {
            list.push( await this.nftAsyncResolver(nfts[i]));
        }

        return { list, count: nfts.length };
    }
    
    async nftAsyncResolver(data: IGoerliNftTransaction) {
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
    }

    async getWalletNFTTransactions(address: string, page: number, pageSize: number) {
        const list = await this._goerli.getNftTransactionsByAddress(address, page, pageSize);
        return { 
            list:list.map(t => this._normalizeNftTransaction(t))
        };
    }

    _normalizeNftTransaction(data:IGoerliNftTransaction):INftTransaction{
        return {
            type: NftTxType.baseInfo,
            txHash: data.hash,
            blockNumber: parseInt(data.blockNumber),
            contract_address: data.contractAddress,
            tokenId: data.tokenID,
            to: data.to,
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