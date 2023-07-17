import { controller, httpGet, interfaces, queryParam, requestParam, response } from "inversify-express-utils";
import { INftsManager, INftPagination, Web3NftTokenData } from '../modules/nfts/types';
import { errorHandler } from "./decorator/error-handler";
import { ChainId } from '../modules/transactions/types';
import { paginationValidator } from "./validator/pagination-validator";
import * as express from 'express';
import { inject } from "inversify";
import { IDS } from '../types/index';
import { NftCache } from "../modules/nfts/NftCache";
import { IWeb3Manager } from "../services/web3/types";

const chainValidator = [ChainId.mumbai, ChainId.matic].join('|')

@controller('/nfts')
export class NftsController implements interfaces.Controller {
    @inject(IDS.MODULES.NftsManagerFactory) private _nftManagerFactory: (named:string) => INftsManager
    @inject(IDS.SERVICE.WEB3.Web3ManagerFactory) private _web3ManagerFactory: (named:string) => IWeb3Manager
    @inject(IDS.CONFIG.EnableNftCache) _isNftCacheEnabled: boolean
    @inject(IDS.MODULES.NftCache) _nftCache: NftCache

    @httpGet(`/:chain(${chainValidator})/:address`, ...paginationValidator())
    @errorHandler()
    async getAddressNfts(
        @requestParam('chain') chain: ChainId,
        @requestParam('address') address: string,
        @queryParam('continue') paginator:INftPagination,
        @queryParam('page') page: number = 1,
        @queryParam('pageSize') pageSize: number = 10,
        @response() res: express.Response
    ){
        const manager = this._nftManagerFactory(chain)
        const result = await manager.getWalletAllNFTs(address, Object.assign({},{page, pageSize}, paginator))

        res.json(result)
    }

    @httpGet(`/transactions/:chain(${chainValidator})/:address`, ...paginationValidator())
    @errorHandler()
    async getAddressNftTransactions(
        @requestParam('chain') chain: ChainId,
        @requestParam('address') address: string,
        @queryParam('continue') paginator:INftPagination,
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
        @requestParam('block') blockNumber: number,
        @response() res: express.Response
    ){
        const web3manager = this._web3ManagerFactory(chain)

        const [tokenDetails, blockDate, comments] = await Promise.all([
            this.getTokenData(chain, contractAddress, tokenId),
            web3manager.getDateFromBlock(blockNumber),
            web3manager.getComments(contractAddress, tokenId)
        ])
        
        const result = Object.assign({},
            tokenDetails,
            {date: blockDate, comments}
        )

        res.json(result)
    }

    @httpGet(`/token-details/:chain(${chainValidator})/contract/:contractAddress/token/:tokenId`)
    @errorHandler()
    async getTokenDetails(
        @requestParam('chain') chain: ChainId,
        @requestParam('contractAddress') contractAddress: string,
        @requestParam('tokenId') tokenId: string,
        @queryParam('category') category,
        @response() res: express.Response
    ){
        const result = await this.getTokenData(chain, contractAddress, tokenId)

        res.json(result)
    }

    private async getTokenData(chain: ChainId, contractAddress:string, tokenId:string):Promise<Web3NftTokenData>{
        let token:Web3NftTokenData | null = null

        if(this._isNftCacheEnabled){
            token = await this._nftCache.getTokenDetails(chain, contractAddress, tokenId)
        }

        if(!token){
            const manager = this._nftManagerFactory(chain)
            token = await manager.getNftDetails(contractAddress, tokenId)
        }

        if(this._isNftCacheEnabled && token){
            this._nftCache.saveTokenData(chain, token)
        }

        return token
    }
}