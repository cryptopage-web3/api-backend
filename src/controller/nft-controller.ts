import { controller, httpGet, interfaces, queryParam, requestParam, response } from "inversify-express-utils";
import { INftsManager } from '../modules/nfts/types';
import { errorHandler } from "./decorator/error-handler";
import { ChainId } from '../modules/transactions/types';
import { paginationValidator } from "./validator/pagination-validator";
import * as express from 'express';
import { inject } from "inversify";
import { IDS } from '../types/index';

const chainValidator = [ChainId.bsc,ChainId.eth,ChainId.matic].join('|')

@controller('/nfts')
export class NftsController implements interfaces.Controller {
    @inject(IDS.MODULES.NftsManagerFactory) private _nftManagerFactory: (named:string) => INftsManager

    @httpGet(`/:chain(${chainValidator})/:address`, ...paginationValidator())
    @errorHandler()
    async getAddressNfts(
        @requestParam('chain') chain: ChainId,
        @requestParam('address') address: string,
        @queryParam('page') page: number,
        @queryParam('pageSize') pageSize: number,
        @response() res: express.Response
    ){
        const manager = this._nftManagerFactory(chain)
        const result = await manager.getWalletAllNFTs(address, page, pageSize)

        res.json(result)
    }

    @httpGet(`/transactions/:chain(${chainValidator})/:address`, ...paginationValidator())
    @errorHandler()
    async getAddressNftTransactions(
        @requestParam('chain') chain: ChainId,
        @requestParam('address') address: string,
        @queryParam('page') page: number,
        @queryParam('pageSize') pageSize: number,
        @response() res: express.Response
    ){
        const manager = this._nftManagerFactory(chain)
        const result = await manager.getWalletNFTTransactions(address, page, pageSize)

        res.json(result)
    }
}