import { inject, injectable } from "inversify";
import { INftsManager, INftsList, INftTransaction, NftTxType } from './types';
import { GoerliScanApi } from './../../services/etherscan/goerliscan-api';
import { ChainId } from "modules/transactions/types";
import { IDS } from '../../types/index';
import { IGoerliNftTransaction } from '../../services/etherscan/types';
import { IWeb3Manager } from '../../services/web3/types';
import { NftCache } from './NftCache';

@injectable()
export class GoerliScanNFTsManager implements INftsManager {
    @inject(IDS.SERVICE.GoerliScanApi) _goerli:GoerliScanApi
    @inject(IDS.SERVICE.WEB3.Web3Manager) private _web3Manager: IWeb3Manager
    @inject(IDS.MODULES.NftCache) _nftCache: NftCache

    _chain: ChainId;

    async getWalletAllNFTs(address, page, pageSize):Promise<INftsList> {
        const list = await this._goerli.getNftTransfers(address);
        const nfts = list.filter(e => e.to.toLowerCase() === address.toLowerCase());
        return { list: nfts, count: nfts.length };
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