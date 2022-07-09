import { inject, injectable } from 'inversify';
import { ITransactionManager } from './types';
import { IDS } from '../../types/index';
import { EtherscanApi } from '../../services/etherscan/index';

const UnmarshalApi = require('./../../services/unmarshal');

const config = require('./../../enums/chains');

@injectable()
export class EthTransactionManager implements ITransactionManager {
    @inject(IDS.SERVICE.EtherscanApi) private _etherscan: EtherscanApi;

    getWalletAllTransactions(address, skip, limit) {
        const service = new UnmarshalApi({ address, config: config.eth });
        return service.getWalletAllTransactions(skip, limit);
    }
    
    getTransactionDetails(txHash) {
        const service = new UnmarshalApi({ config: config.eth });
        return service.getTransactionDetails(txHash);
    }
    
    getWalletTokenTransfers(address, skip, limit) {
        const service = new UnmarshalApi({ address, config: config.eth });
        return service.getWalletTokenTransfers(skip, limit);
    }
}