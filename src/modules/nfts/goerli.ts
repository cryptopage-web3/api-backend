import { injectable } from "inversify";
import { INftsManager, INftsList } from './types';
import { GoerliScanApi } from './../../services/etherscan/goerliscan-api';
import { ChainId } from "modules/transactions/types";

@injectable()
export class GoerliScanNFTsManager implements INftsManager {
    _chain: ChainId;
    getNftTransactionDetails(contractAddress: string, tokenId: string, blockNumber: number) {
        throw new Error("Method not implemented.");
    }

    async getWalletAllNFTs(address, page, pageSize):Promise<INftsList> {
        const goerliScanInstance = new GoerliScanApi();
        const list: any = await goerliScanInstance.getNftTransfers(address);
        const nfts = list.filter(e => e.to.toLowerCase() === address.toLowerCase());
        return { list: nfts, count: nfts.length };
    }
    
    async getWalletNFTTransactions(address, page, pageSize) {
        const goerliScanInstance = new GoerliScanApi();
        const list: any = await goerliScanInstance.getNftTransfers(address);
        return { list, count: list.length };
    }
}