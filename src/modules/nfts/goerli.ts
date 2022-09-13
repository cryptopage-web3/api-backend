import { inject, injectable } from "inversify";
import { INftsManager, INftsList } from './types';
import { GoerliScanApi } from './../../services/etherscan/goerliscan-api';
import { ChainId } from "modules/transactions/types";
import { IDS } from '../../types/index';

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
    
    async getWalletNFTTransactions(address, page, pageSize) {
        const list: any = await this._goerli.getNftTransfers(address);
        return { list, count: list.length };
    }
}