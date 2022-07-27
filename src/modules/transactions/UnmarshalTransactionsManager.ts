import { ITransactionManager, ChainId } from './types';
import { UnmarshalApi } from '../../services/unmarshal/UnmarhalApi';

const config = require('../../enums/chains')

export class UnmarshalTransactionsManager implements ITransactionManager {
    _config: any

    constructor(chain: ChainId){
        if(!config[chain]){
            throw new Error(`Invalid chain: ${chain}`)
        }
        this._config = config[chain]
    }

    getWalletAllTransactions(address, {page, pageSize}) {
        const service = new UnmarshalApi({ address, config: this._config });
        return service.getWalletAllTransactions(page, pageSize);
    }
    
    getTransactionDetails(txHash) {
        const service = new UnmarshalApi({ config: this._config });
        return service.getTransactionDetails(txHash);
    }
    
    getWalletTokenTransfers(address, {page, pageSize}) {
        const service = new UnmarshalApi({ address, config: this._config });
        return service.getWalletTokenTransfers(page, pageSize);
    }
}