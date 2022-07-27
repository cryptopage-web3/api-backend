import { inject, injectable } from 'inversify';
import { ITransactionManager, ITransactionsPagination, Paginator } from './types';
import { TronGridApi } from '../../services/trongrid/trongrid-api';
import { IDS } from '../../types/index';

@injectable()
export class TronGridApiTransactionsManager implements ITransactionManager {
    @inject(IDS.SERVICE.TrongridApi) private _tronGridApi: TronGridApi

    getWalletAllTransactions(address: string, opts: ITransactionsPagination): Promise<Paginator> {
        return this._tronGridApi.getWalletAllTransactions(address, opts.pageSize, opts.fingerprint)
    }

    getWalletTokenTransfers(address: string, opts: ITransactionsPagination) {
        return this._tronGridApi.getWalletTokenTransfers(address, opts.pageSize, opts.fingerprint)
    }

    getTransactionDetails(txHash: string) {
        throw new Error('Method not implemented')
    }
}