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
        return this._goerliScanApi.getTokenTransfers(address, opts.pageSize, opts.beforeHash)
    }

    getTransactionDetails(txHash: string) {
        return this._goerliScanApi.getTransactionDetails(txHash);
    }
}