import { INftsManager } from './types';
import { UnmarshalApi } from '../../services/unmarshal/UnmarhalApi';
import { inject, injectable } from 'inversify';
import { IDS } from '../../types/index';

@injectable()
export class UnmarshalNftsManager implements INftsManager {
    _unmarshalApi: UnmarshalApi

    constructor(@inject(IDS.SERVICE.UnmarshalApiFactory) _unmarshalApiFactory: () => UnmarshalApi){
        this._unmarshalApi = _unmarshalApiFactory()
    }

    getWalletAllNFTs(address, page, pageSize) {
        return this._unmarshalApi.getWalletAllNFTs(address, page, pageSize);
    }
    
    getWalletNFTTransactions(address, page, pageSize) {
        return this._unmarshalApi.getWalletNFTTransactions(address, page, pageSize);
    }
}