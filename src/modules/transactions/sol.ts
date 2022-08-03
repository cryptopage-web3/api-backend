import { inject, injectable } from 'inversify';
import { ITransactionManager, ITransactionsPagination, Paginator } from './types';
import { IDS } from '../../types/index';
import { SolScanApi } from '../../services/solscan/solscan-api';

@injectable()
export class SolscanTtransactionsManager implements ITransactionManager {
    @inject(IDS.SERVICE.SolScanApi) private _solScanApi:SolScanApi

    getWalletAllTransactions(address: string, opts: ITransactionsPagination): Promise<Paginator> {
        return this._solScanApi.getWalletAllTransactions(address, opts.pageSize, opts.beforeHash)
    }

    getWalletTokenTransfers(address: string, opts: ITransactionsPagination) {
        throw new Error('Method not implemented')
    }

    getTransactionDetails(txHash: string) {
        throw new Error('Method not implemented')
    }
}