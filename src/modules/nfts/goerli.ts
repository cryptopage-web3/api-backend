import { injectable } from "inversify";
import { INftsManager, INftsList } from './types';
import { GoerliScanApi } from './../../services/etherscan/goerliscan-api';

@injectable()
export class GoerliScanNFTsManager implements INftsManager {

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