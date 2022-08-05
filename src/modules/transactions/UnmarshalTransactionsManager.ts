import { ITransactionManager } from './types';
import { UnmarshalApi } from '../../services/unmarshal/UnmarhalApi';
import { inject, injectable } from 'inversify';
import { IDS } from '../../types/index';

@injectable()
export class UnmarshalTransactionsManager implements ITransactionManager {
    _unmarshalApi: UnmarshalApi

    constructor(@inject(IDS.SERVICE.UnmarshalApi) unmarshalApi: UnmarshalApi){
        this._unmarshalApi = unmarshalApi
    }

    getWalletAllTransactions(address, {page, pageSize}) {
        return this._unmarshalApi.getWalletAllTransactions(address, page, pageSize);
    }
    
    getTransactionDetails(txHash) {
        return this._unmarshalApi.getTransactionDetails(txHash);
    }
    
    getWalletTokenTransfers(address, {page, pageSize}) {
        return this._unmarshalApi.getWalletTokenTransfers(address, page, pageSize);
    }
}