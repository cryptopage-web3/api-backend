import { controller, httpGet, httpPost, request, response } from "inversify-express-utils";
import * as express from 'express';
import { errorHandler } from "./decorator/error-handler";
import { userLogValidator } from "./validator/user-validator";
import { inject } from "inversify";
import { IDS, defaultAllowedRefferers } from "../types";
import { UserRepo } from "../orm/repo/user-repor";
import { getLogger } from "log4js";
import { reffererValidator } from "./validator/refferer-validator";
const logger = getLogger('controller-user')

@controller('/user')
class UserController {
    @inject(IDS.ORM.REPO.UserRepo) _repo:UserRepo

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
}