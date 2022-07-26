import { INftsManager } from './types';
import { ChainId } from '../transactions/types';
import { UnmarshalApi } from '../../services/unmarshal/UnmarhalApi';

const config = require('./../../enums/chains');

export class UnmarshalNftsManager implements INftsManager {
    _config: any

    constructor(chain: ChainId){
        if(!config[chain]){
            throw new Error(`Invalid chain: ${chain}`)
        }
        this._config = config[chain]
    }

    getWalletAllNFTs(address, page, pageSize) {
        const service = new UnmarshalApi({ address, config: this._config });
        return service.getWalletAllNFTs(page, pageSize);
    }
    
    getWalletNFTTransactions(address, page, pageSize) {
        const service = new UnmarshalApi({ address, config: this._config });
        return service.getWalletNFTTransactions(page, pageSize);
    }
}