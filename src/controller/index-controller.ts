import { controller, httpGet, httpPost, interfaces, queryParam, request, response } from "inversify-express-utils";
import { appleSiteJson } from '../enums/appleSite';
import { errorHandler } from './decorator/error-handler';
import * as express from 'express';
import { inject } from 'inversify';
import { IDS } from '../types/index';
import { ErrorLogRepo } from '../orm/repo/error-log-repo';
import { FrontErrorsRepo } from "../orm/repo/front-error-repo";
import { reffererValidator } from "./validator/refferer-validator";
import { envToArray } from "../util/env-util";
import { frontErrorValidator } from "./validator/front-error-validator";

@controller('/')
class IndexController implements interfaces.Controller {
    @inject(IDS.ORM.REPO.ErrorLogRepo) _errorLogRepo: ErrorLogRepo
    @inject(IDS.ORM.REPO.FrontErrorsRepo) _frontErrorsRepo: FrontErrorsRepo

    @httpGet('/health-check')
    healthCheck(@response() res){
        res.json({ success: true });
    }

    @httpGet('/login*')
    login(@response() res){
        res.json(appleSiteJson)
    }

    @httpGet('/apple-app-site-association')
    appleSiteAssociation(@response() res){
        res.json(appleSiteJson); 
    }

    @httpGet('last-errors')
    @errorHandler()
    async getLastErrors(
        @request() req: express.Request,
        @response() res: express.Response, 
        @queryParam('limit') limit = '10'){
            const errors = await this._errorLogRepo.getLastErrors(parseInt(limit))
            res.json({errors})
    }

    @httpGet('last-front-errors')
    @errorHandler()
    async getLastFrontErrors(
        @request() req: express.Request,
        @response() res: express.Response, 
        @queryParam('limit') limit = '10'){
            const errors = await this._frontErrorsRepo.getLastErrors(parseInt(limit))
            res.json({errors})
    }

    @httpPost('front-error', reffererValidator(envToArray('ALLOWED_FRONT_ERROR_REFFERER',['app.crypto.page','api-m.crypto.page','localhost:3000'])), ...frontErrorValidator())
    @errorHandler()
    async saveFrontError(
        @request() req: express.Request,
        @response() res: express.Response,
        
    ){
        const ip: string = (req.headers as any)['x-real-ip'] || req.ip

        await this._frontErrorsRepo.saveError(
            req.body.message, req.body.callStack, ip
        )
        
        res.json({status:'ok'})
    }
}