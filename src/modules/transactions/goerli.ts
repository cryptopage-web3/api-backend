import { inject, injectable } from 'inversify';
import { ITransactionManager, ITransactionsPagination, Paginator } from './types';
import { IDS } from '../../types/index';
import { GoerliScanApi } from './../../services/etherscan/goerliscan-api';
import { IGoerliTransaction } from '../../services/etherscan/types';

@injectable()
export class GoerliscanTtransactionsManager implements ITransactionManager {
    @inject(IDS.SERVICE.GoerliScanApi) private _goerliScanApi: GoerliScanApi

    async getWalletAllTransactions(address: string, opts: ITransactionsPagination): Promise<Paginator> {
        const transactions = await this._goerliScanApi.getWalletAllTransactions(address, opts.page, opts.pageSize)

        return {
            transactions: transactions.map(t => this._normalizeTransaction(t))
        }
    }

    _normalizeTransaction(tx: IGoerliTransaction){
        return Object.assign({}, tx, {
            value: parseInt(tx.value) / Math.pow(10, 18),
            date: new Date(parseInt(tx.timeStamp) * 1000)
        })
    }

    getWalletTokenTransfers(address: string, opts: ITransactionsPagination) {
        return this._goerliScanApi.getTokenTransfers(address, opts.pageSize)
    }

    getTransactionDetails(txHash: string) {
        return this._goerliScanApi.getTransactionDetails(txHash);
    }
}