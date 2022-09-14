import { inject, injectable } from 'inversify';
import { ITransactionManager, ITransactionsPagination, Paginator } from './types';
import { IDS } from '../../types/index';
import { GoerliScanApi } from './../../services/etherscan/goerliscan-api';

@injectable()
export class GoerliscanTtransactionsManager implements ITransactionManager {
    @inject(IDS.SERVICE.GoerliScanApi) private _goerliScanApi: GoerliScanApi

    async getWalletAllTransactions(address: string, opts: ITransactionsPagination): Promise<Paginator> {
        const result = await this._goerliScanApi.getWalletAllTransactions(address, opts.page, opts.pageSize)

        result.transactions = result.transactions.map(t => this._normalizeTransaction(t))

        return result;
    }

    _normalizeTransaction(tx){
        tx.value = parseInt(tx.value) / Math.pow(10, 18)

        return tx
    }

    getWalletTokenTransfers(address: string, opts: ITransactionsPagination) {
        return this._goerliScanApi.getTokenTransfers(address, opts.pageSize, opts.beforeHash)
    }

    getTransactionDetails(txHash: string) {
        return this._goerliScanApi.getTransactionDetails(txHash);
    }
}