import { inject, injectable } from "inversify";
import { INftsManager, INftsList, INftTransaction, NftTxType } from './types';
import { GoerliScanApi } from './../../services/etherscan/goerliscan-api';
import { ChainId } from "modules/transactions/types";
import { IDS } from '../../types/index';
import { IGoerliNftTransaction } from '../../services/etherscan/types';

@injectable()
export class GoerliScanNFTsManager implements INftsManager {
    @inject(IDS.SERVICE.GoerliScanApi) _goerli:GoerliScanApi

    _chain: ChainId;

    getNftTransactionDetails(contractAddress: string, tokenId: string, blockNumber: number) {
        throw new Error("Method not implemented.");
    }

    async getWalletAllNFTs(address, page, pageSize):Promise<INftsList> {
        const list = await this._goerli.getNftTransfers(address);
        const nfts = list.filter(e => e.to.toLowerCase() === address.toLowerCase());
        return { list: nfts, count: nfts.length };
    }
    
    async getWalletNFTTransactions(address: string, page: number, pageSize: number) {
        const list = await this._goerli.getNftTransactionsByAddress(address, page, pageSize);
        return { 
            list:list.map(t => this._normalizeNftTransaction(t)),
            count: list.length 
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
}