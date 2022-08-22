import { inject, injectable } from 'inversify';
import { ITransactionManager, ITransactionsPagination, Paginator } from './types';
import { IDS } from '../../types/index';
import { GoerliScanApi } from './../../services/etherscan/goerliscan-api';

@injectable()
export class GoerliscanTtransactionsManager implements ITransactionManager {
    @inject(IDS.SERVICE.GoerliScanApi) private _goerliScanApi: GoerliScanApi

    getWalletAllTransactions(address: string, opts: ITransactionsPagination): Promise<Paginator> {
        return this._goerliScanApi.getWalletAllTransactions(address, opts.pageSize, opts.beforeHash)
    }

    getWalletTokenTransfers(address: string, opts: ITransactionsPagination) {
        throw new Error('Method not implemented')
    }

    getTransactionDetails(txHash: string) {
        throw new Error('Method not implemented')
    }
}