import { controller, httpGet, interfaces, queryParam, request, response } from "inversify-express-utils";
import { appleSiteJson } from '../enums/appleSite';
import { errorHandler } from './decorator/error-handler';
import * as express from 'express';
import { inject } from 'inversify';
import { IDS } from '../types/index';
import { ErrorLogRepo } from '../orm/repo/error-log-repo';

@controller('/')
class IndexController implements interfaces.Controller {
    @inject(IDS.ORM.REPO.ErrorLogRepo) _errorLogRepo: ErrorLogRepo

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
}