import { inject, injectable } from 'inversify';
import { ITransactionManager, ITransactionsPagination, Paginator } from './types';
import { IDS } from '../../types/index';
import { Alchemy, AssetTransfersCategory, AssetTransfersWithMetadataResult } from 'alchemy-sdk';

@injectable()
export class AlchemyTransactionsManager implements ITransactionManager {
    @inject(IDS.SERVICE.AlchemySdk) _alchemy:Alchemy

    async getWalletAllTransactions(address: string, opts: ITransactionsPagination): Promise<Paginator> {
        const response = await this._alchemy.core.getAssetTransfers({
            toAddress: address,
            category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20],
            withMetadata: true,
            maxCount: opts.pageSize,
            pageKey: opts.pageKey
        })

        return {
            transactions: response.transfers.map(t => this._normalizeTransaction(t)),
            continue: {
                pageKey: response.pageKey
            }
        }
    }

    _normalizeTransaction(tx: AssetTransfersWithMetadataResult){
        return Object.assign({}, {
            hash: tx.hash,
            blockNum: parseInt(tx.blockNum),
            from: tx.from,
            to: tx.to,
            value: tx.value,
            asset: tx.asset,
            category: tx.category,
            date: tx.metadata.blockTimestamp
        })
    }

    getWalletTokenTransfers(address: string, opts: ITransactionsPagination) {
        throw new Error('Deprecated method')
    }

    async getTransactionDetails(txHash: string) {
        return this._alchemy.transact.getTransaction(txHash)
    }
}