import { inject, injectable } from 'inversify';
import { Etherscan, ITransactionManager, Paginator, ITransactionsPagination } from './types';
import { IDS } from '../../types/index';
import { EtherscanApi } from '../../services/etherscan/etherscan-api';
import { UnmarshalApi } from '../../services/unmarshal/UnmarhalApi';

@injectable()
export class EthTransactionManager implements ITransactionManager {
    @inject(IDS.SERVICE.EtherscanApi) private _etherscan: EtherscanApi;

    _unmarshalApi: UnmarshalApi

    constructor(@inject(IDS.SERVICE.UnmarshalApiFactory) _unmarshalApiFactory: ()=> UnmarshalApi){
        this._unmarshalApi = _unmarshalApiFactory()
    }
    
    async getWalletAllTransactions(address:string, offset:ITransactionsPagination) {
        let transactions:Etherscan.ITransactionData[] = [],
            erc20Transactions:Etherscan.IErc20TransactionData[] = [],
            count = 0;

        const txGlobalOffset = offset?.tx || 0,
            erc20GlobalOffset = offset?.erc20 || 0,
            txPaginator = this.buildFloatPaginator(txGlobalOffset),
            erc20Paginator = this.buildFloatPaginator(erc20GlobalOffset)

        await Promise.all([
            this._etherscan.getTransactions(address, txPaginator.page, txPaginator.limit)
                .then(txs => {transactions = txs.map(r => this.mapTransactionType(r,Etherscan.TransactionType.normal))}),
            this._etherscan.getErc20Trnsactions(address, erc20Paginator.page, erc20Paginator.limit)
                .then(txs => {erc20Transactions = txs.map(r => this.mapTransactionType(r, Etherscan.TransactionType.erc20))}),
            this.getTransactionsCount(address)
                .then(cnt => { count = cnt })
                .catch(err => { console.error('Failed to get transactions count', address, err.message)})
        ])

        transactions = this.continuePaginate(transactions, txPaginator.limit, txGlobalOffset)
        erc20Transactions = this.continuePaginate(erc20Transactions, erc20Paginator.limit, erc20GlobalOffset)

        return this.buildTransactionsPage(
            address,
            transactions,
            erc20Transactions, 
            txGlobalOffset,
            erc20GlobalOffset,
            count,
            offset.pageSize
        )
    }

    private buildFloatPaginator(offset: number, pageSize = 150, extendedPageSize = 200): {limit:number, page:number} {
        const lastPageOffset = (offset - Math.floor(offset / pageSize) * pageSize),
            middle = pageSize / 2;

        const loadPageSize = lastPageOffset > middle ? extendedPageSize : pageSize,
            loadPage = Math.floor(offset / loadPageSize) + 1;

        return {
            page: loadPage,
            limit: loadPageSize
        }
    }

    private mapTransactionType(txData, transactionType:Etherscan.TransactionType){
        return Object.assign({}, txData, {transactionType})
    }

    private continuePaginate<T>(items: T[], pageSize:number, globalOffset: number): T[]{
        const lastPageOffset = (globalOffset - Math.floor(globalOffset / pageSize) * pageSize)

        if(lastPageOffset > 1){
            items.splice(0, lastPageOffset -1)
        }
        
        return items
    }
    
    private buildTransactionsPage(address: string, txs: Etherscan.ITransactionData[], erc20txs: Etherscan.IErc20TransactionData[], txOffset: number, erc20Offset: number, totalTxCount: number, pageSize:number): Paginator {
        const result: Etherscan.EthTransaction[] = []

        let done = false,
            tmpTransaction: Etherscan.EthTransaction,
            countTxOnPage = 0,
            countErc20OnPage = 0
        
        function incrementCounnterFroTmpTransaction (){
            if(tmpTransaction.transactionType == Etherscan.TransactionType.normal){
                countTxOnPage++
            } else {
                countErc20OnPage++
            }
        }
            
        while(!done){
            if(txs.length > 0 && erc20txs.length == 0){
                tmpTransaction = txs.shift() as Etherscan.ITransactionData
            } else if(txs.length == 0 && erc20txs.length > 0){
                tmpTransaction = erc20txs.shift() as Etherscan.IErc20TransactionData
            } else if(txs[0].blockNumber >= erc20txs[0].blockNumber){
                tmpTransaction = txs.shift() as Etherscan.ITransactionData
            } else {
                tmpTransaction = erc20txs.shift() as Etherscan.IErc20TransactionData
            }

            if(result.length == 0){
                result.push(tmpTransaction)
                incrementCounnterFroTmpTransaction()
            } else if(tmpTransaction.hash == result[result.length - 1].hash){
                const prevTx:Etherscan.ITransactionData = result[result.length - 1] as Etherscan.ITransactionData

                if(tmpTransaction.to == address){
                    prevTx.receive = (prevTx.receive || []);
                    prevTx.receive.push(tmpTransaction as Etherscan.IErc20TransactionData)
                    incrementCounnterFroTmpTransaction()
                } else {
                    prevTx.send = (prevTx.send || []);
                    prevTx.send.push(tmpTransaction as Etherscan.IErc20TransactionData)
                    incrementCounnterFroTmpTransaction()
                }
            } else if(result.length == pageSize){
                done = true
            } else {
                result.push(tmpTransaction)
                incrementCounnterFroTmpTransaction()
            }

            if(txs.length == 0 && erc20txs.length == 0){
                done = true
            }
        }

        return {
            transactions: result.map(tx => this.mapOperationType(tx, address)),
            continue:{
                tx: txOffset + countTxOnPage + (countTxOnPage > 0 ? 1 : 0),
                erc20: erc20Offset + countErc20OnPage + (countErc20OnPage > 0 ? 1 : 0)
            },
            count: totalTxCount
        }
    }

    private mapOperationType(tx: Etherscan.EthTransaction, address:string): Etherscan.EthTransaction{
        let operationType:Etherscan.OperationType

        if(tx.send && tx.receive || tx.from == address && tx.receive || tx.to == address && tx.send){
            operationType = Etherscan.OperationType.swap
        } else if(tx.send && !tx.receive || tx.from == address){
            operationType = Etherscan.OperationType.send
        } else {
            operationType = Etherscan.OperationType.receive
        }

        return Object.assign({},tx, {operationType})
    }

    getTransactionsCount(address:string):Promise<number>{
        return this._unmarshalApi.getTransactionsCount(address)
    }

    getTransactionDetails(txHash) {
        return this._unmarshalApi.getTransactionDetails(txHash);
    }
    
    getWalletTokenTransfers(address, {page, pageSize}) {
        return this._unmarshalApi.getWalletTokenTransfers(address, page, pageSize);
    }
}