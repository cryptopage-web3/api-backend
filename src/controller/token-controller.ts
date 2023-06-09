import { controller, httpGet, interfaces, requestParam, response } from "inversify-express-utils";
import { ITokenManager } from '../modules/tokens/types';
import { errorHandler } from "./decorator/error-handler";
import * as express from 'express';
import { inject } from "inversify";
import { IDS } from '../types/index';
import { ChainId } from "../modules/transactions/types";

const chainValidator = [ChainId.mumbai, ChainId.matic].join('|')

@controller('/tokens')
export class TokenController implements interfaces.Controller {
    @inject(IDS.MODULES.TokenManagerFactory) _tokenManagerFactory:(chain)=>ITokenManager

    @httpGet(`/:chain(${chainValidator})/:address`)
    @errorHandler()
    async getAddressTokens(
        @requestParam('chain') chain:string, 
        @requestParam('address') address:string,
        @response() res: express.Response
    ){
        const manager = this._tokenManagerFactory(chain)
        const result = await manager.getWalletTokens(address)

        res.json(result)
    }
}