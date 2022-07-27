import { inject } from "inversify";
import { controller, httpGet, interfaces, queryParam, requestParam, response } from "inversify-express-utils";
import { IDS } from '../types/index';
import { ITransactionManager, ITransactionsPagination, ChainId } from '../modules/transactions/types';
import * as express from "express";
import { errorHandler } from "./decorator/error-handler";
import { getTransactionsValidator } from './validator/get-transactionsv-validator';
import { paginationValidator } from './validator/pagination-validator';

const chainValidator = [ChainId.bsc,ChainId.eth,ChainId.matic,ChainId.sol,ChainId.tron].join('|')

@controller('/transactions')
export class TransactionsController implements interfaces.Controller {
    @inject(IDS.MODULES.TransactionManagerFactory) private _txManagerFactory: (named:string) => ITransactionManager

    @httpGet(`/:chain(${chainValidator})/:address`, ...getTransactionsValidator())
    @errorHandler()
    private async getAddressTransactions(
        @requestParam('chain') chain:string, 
        @requestParam('address') address:string,
        @queryParam('continue') paginator:ITransactionsPagination,
        @queryParam('page') page: number = 1,
        @queryParam('pageSize') pageSize: number = 10,
        @response() res: express.Response){
            const manager = this._txManagerFactory(chain)
            const resultPage = await manager.getWalletAllTransactions(
                address, Object.assign({}, paginator,{page, pageSize})
            )
            
            res.json(resultPage)
    }

    @httpGet(`/detail/:chain(${chainValidator})/:txHash`)
    @errorHandler()
    private async getTransactionDetails(
        @requestParam('chain') chain: string,
        @requestParam('txHash') txHash: string,
        @response() res: express.Response
    ){
        const manager = this._txManagerFactory(chain);
        const result = await manager.getTransactionDetails(txHash);

        res.json(result);
    }

    @httpGet(`/transfers/:chain(${chainValidator})/:address`, ...paginationValidator())
    @errorHandler()
    private async getAddressTransfers(
        @requestParam('chain') chain: string,
        @requestParam('address') address: string,
        @queryParam('page') page: number = 0,
        @queryParam('pageSize') pageSize: number = 10,
        @response() res: express.Response
    ){
        const manager = this._txManagerFactory(chain);
        const result = await manager.getWalletTokenTransfers(address, {page, pageSize});
        
        res.json(result);
    }
}