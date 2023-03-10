import { controller, httpGet, interfaces, queryParam, requestParam, response } from "inversify-express-utils";
import { INftsManager, INftTransactionsPagination } from '../modules/nfts/types';
import { errorHandler } from "./decorator/error-handler";
import { ChainId } from '../modules/transactions/types';
import { paginationValidator } from "./validator/pagination-validator";
import * as express from 'express';
import { inject } from "inversify";
import { IDS } from '../types/index';

const chainValidator = [ChainId.bsc,ChainId.eth,ChainId.matic, ChainId.goerli].join('|')

@controller('/nfts')
export class NftsController implements interfaces.Controller {
    @inject(IDS.MODULES.NftsManagerFactory) private _nftManagerFactory: (named:string) => INftsManager

    @httpGet(`/:chain(${chainValidator})/:address`, ...paginationValidator())
    @errorHandler()
    async getAddressNfts(
        @requestParam('chain') chain: ChainId,
        @requestParam('address') address: string,
        @queryParam('page') page: number = 1,
        @queryParam('pageSize') pageSize: number = 10,
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
        @queryParam('continue') paginator:INftTransactionsPagination,
        @queryParam('page') page: number = 1,
        @queryParam('pageSize') pageSize: number = 10,
        @response() res: express.Response
    ){
        const manager = this._nftManagerFactory(chain)
        const result = await manager.getWalletNFTTransactions(
            address, Object.assign({},{page, pageSize}, paginator)
        )

        res.json(result)
    }

    @httpGet(`/transaction/:chain(${chainValidator})/details/:contractAddress/:tokenId/:block(\\d+)`)
    @errorHandler()
    async getTransactionDetails(
        @requestParam('chain') chain: ChainId,
        @requestParam('contractAddress') contractAddress: string,
        @requestParam('tokenId') tokenId: string,
        @requestParam('block') block: number,
        @response() res: express.Response
    ){
        const manager = this._nftManagerFactory(chain)
        
        const result = await manager.getNftTransactionDetails(contractAddress, tokenId, block)

        res.json(result)
    }

    @httpGet(`/token-details/:chain(${chainValidator})/contract/:contractAddress/token/:tokenId`)
    @errorHandler()
    async getTokenDetails(
        @requestParam('chain') chain: ChainId,
        @requestParam('contractAddress') contractAddress: string,
        @requestParam('tokenId') tokenId: string,
        @response() res: express.Response
    ){
        const manager = this._nftManagerFactory(chain)

        const result = await manager.getNftDetails(contractAddress, tokenId)

        res.json(result)
    }
}