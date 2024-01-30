import { controller, httpGet, httpPost, request, requestParam, response } from "inversify-express-utils";
import * as express from 'express';
import { errorHandler } from "./decorator/error-handler";
import { userLogValidator } from "./validator/user-validator";
import { inject } from "inversify";
import { IDS, defaultAllowedRefferers } from "../types";
import { UserRepo } from "../orm/repo/user-repor";
import { getLogger } from "log4js";
import { reffererValidator } from "./validator/refferer-validator";
import { DebankApi } from "../services/debank/DebankApi";
const logger = getLogger('controller-user')

@controller('/user')
class UserController {
    @inject(IDS.ORM.REPO.UserRepo) _repo:UserRepo
    @inject(IDS.SERVICE.DebankApi) _debank: DebankApi

    @httpPost('/log', reffererValidator(defaultAllowedRefferers), ...userLogValidator())
    @errorHandler()
    async signIn(
        @request() req: express.Request,
        @response() res: express.Response
        
    ){
        const ip: string = (req.headers as any)['x-real-ip'] || req.ip
        await this._repo.log(req.body.address, ip).catch(err =>{
            logger.error(err)
        })

        res.json({status:'ok'})
    }

    @httpGet('/last-registered')
    @errorHandler()
    async newUsers(
        @request() req: express.Request,
        @response() res: express.Response
    ){
        const users = await this._repo.getNewUsers()

        res.json(users.map(u => ({address: u.address})))
    }

    @httpGet('/tokens/:address')
    @errorHandler()
    async tokens(
        @requestParam('address') address: string,
        @response() res: express.Response
    ){
        const tokens = await this._debank.getWalletTokensInAllChains(address)

        res.json({tokens: tokens.map(({
            chain, name, symbol, display_symbol, optimized_symbol, logo_url, price,is_core, amount
        })=>({
            chain, name, symbol: optimized_symbol || display_symbol, logo_url, price, amount
        }))})
    }
}