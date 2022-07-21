import { inject, injectable } from 'inversify';
import { Etherscan, ITransactionManager, Paginator, ITransactionsPagination } from './types';
import { IDS } from '../../types/index';
import { EtherscanApi } from '../../services/etherscan/etherscan-api';

const UnmarshalApi = require('./../../services/unmarshal');

const config = require('./../../enums/chains');

@injectable()
export class EthTransactionManager implements ITransactionManager {
    @inject(IDS.SERVICE.EtherscanApi) private _etherscan: EtherscanApi;

    async getWalletAllTransactions(address:string, offset:ITransactionsPagination) {
        let transactions:Etherscan.ITransactionData[] = [],
            erc20Transactions:Etherscan.IErc20TransactionData[] = [],
            count = 0;

        const txGlobalOffset = typeof offset?.tx === 'string' ? parseInt(offset.tx) : 0,
            erc20GlobalOffset = typeof offset?.erc20 === 'string' ? parseInt(offset.erc20) : 0,
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
            count
        )
    }

    private buildFloatPaginator(offset: number, pageSize = 100, extendedPageSize = 150): {limit:number, page:number} {
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
    
    private buildTransactionsPage(address: string, txs: Etherscan.ITransactionData[], erc20txs: Etherscan.IErc20TransactionData[], txOffset: number, erc20Offset: number, totalTxCount: number): Paginator {
        const result: Etherscan.EthTransaction[] = [],
            txTotal = txs.length,
            erc20Total = erc20txs.length

        let done = false,
            tmpTransaction: Etherscan.EthTransaction
            
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
            } else if(tmpTransaction.hash == result[result.length - 1].hash){
                const prevTx:Etherscan.ITransactionData = result[result.length - 1] as Etherscan.ITransactionData

                if(tmpTransaction.to == address){
                    prevTx.receive = (prevTx.receive || []);
                    prevTx.receive.push(tmpTransaction as Etherscan.IErc20TransactionData)
                } else {
                    prevTx.send = (prevTx.send || []);
                    prevTx.send.push(tmpTransaction as Etherscan.IErc20TransactionData)
                }
            } else if(result.length == 20){
                done = true
            } else {
                result.push(tmpTransaction)
            }

            if(txs.length == 0 && erc20txs.length == 0){
                done = true
            }
        }

        const countTxOnPage = txTotal - txs.length,
            countErc20OnPage = erc20Total - erc20txs.length;

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
        const service = new UnmarshalApi({ address, config: config.eth });
        return service.getTransactionsCount(config.eth.chainName, address)
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