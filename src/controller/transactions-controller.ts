import { inject } from "inversify";
import { controller, httpGet, interfaces, queryParam, requestParam, response } from "inversify-express-utils";
import { IDS } from '../types/index';
import { ITransactionManager, ITransactionsPagination } from '../modules/transactions/types';
import * as express from "express";

const BAD_REQUEST = 400;

@controller('/transactions')
export class TransactionsController implements interfaces.Controller {
    @inject(IDS.MODULES.TransactionManagerFactory) private _txManagerFactory: (named:string) => ITransactionManager

    /**
     * @swagger
     * /transactions/{chain}/{address}:
     *   get:
     *     summary: Get transactions from address.
     *     description: Get transactions from address.
     *     tags: [Transactions]
     *     parameters:
     *       - in: path
     *         name: chain
     *         required: true
     *         schema:
     *           type: string
     *           enum: [eth, bsc, matic, sol, tron]
     *           default: eth
     *         description: chain name
     *       - in: path
     *         name: address
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: skip
     *         schema:
     *           type: number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: number
     *     responses:
     *       "200":
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *                 $ref: '#/components/schemas/Transactions'
     *       "400":
     *         $ref: '#/components/responses/NotFound'
     */
    @httpGet('/:chain/:address')
    private async getAddressTransactions(
        @requestParam('chain') chain:string, 
        @requestParam('address') address:string,
        @queryParam('continue') paginator:ITransactionsPagination,
        @response() res: express.Response){
        
            const manager = this._txManagerFactory(chain);
            try {
                const resultPage = await manager.getWalletAllTransactions(address, paginator);
                res.json(resultPage);
            } catch (err) {
                res.status(BAD_REQUEST).json({
                    message: err.message
                });
            }
    }

    /**
     * @swagger
     * /transactions/detail/{chain}/{txHash}:
     *   get:
     *     summary: Get transaction.
     *     description: Get transactions.
     *     tags: [Transactions]
     *     parameters:
     *       - in: path
     *         name: chain
     *         required: true
     *         schema:
     *           type: string
     *           enum: [eth, bsc, matic, sol, tron]
     *           default: eth
     *         description: chain name
     *       - in: path
     *         name: txHash
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       "200":
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *                 $ref: '#/components/schemas/Transaction'
     *       "400":
     *         $ref: '#/components/responses/NotFound'
     */
    @httpGet('/detail/:chain/:txHash')
    private async getTransactionDetails(
        @requestParam('chain') chain: string,
        @requestParam('txHash') txHash: string,
        @response() res: express.Response
    ){
        try {
            const manager = this._txManagerFactory(chain);
            const result = await manager.getTransactionDetails(txHash);
            res.json(result);
        } catch (err) {
            res.status(BAD_REQUEST).json({
                message: err.message
            });
        }
    }

    /**
     * @swagger
     * /transactions/transfers/{chain}/{address}:
     *   get:
     *     summary: Get transactions from address.
     *     description: Get transactions from address.
     *     tags: [Transactions]
     *     parameters:
     *       - in: path
     *         name: chain
     *         required: true
     *         schema:
     *           type: string
     *           enum: [eth, bsc, matic, sol, tron]
     *           default: eth
     *         description: chain name
     *       - in: path
     *         name: address
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: skip
     *         schema:
     *           type: number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: number
     *     responses:
     *       "200":
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *                 $ref: '#/components/schemas/Transactions'
     *       "400":
     *         $ref: '#/components/responses/NotFound'
     */
    @httpGet('/transfers/:chain/:address')
    private async getAddressTransfers(
        @requestParam('chain') chain: string,
        @requestParam('address') address: string,
        @queryParam('skip') skip: number = 0,
        @queryParam('limit') limit: number = 20,
        @response() res: express.Response
    ){
        try {
            const manager = this._txManagerFactory(chain);
            const result = await manager.getWalletTokenTransfers(address, skip, limit);
            res.json(result);
        } catch (err) {
            res.status(BAD_REQUEST).json({
                message: err.message
            });
        }
    }
}