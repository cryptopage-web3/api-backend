import { injectable } from 'inversify';
import { ErrorLog } from '../model/error-log';

@injectable()
export class ErrorLogRepo {
    async log(err:string, descr?: string, context?: string | Object){
        let contextNormalized: string = typeof context != 'string' ? JSON.stringify(context) : context
        
        ErrorLog.create({
            key: err,
            descr: (descr?.length || 0) > 400 ? descr?.substring(0, 399) : descr,
            context: (contextNormalized?.length || 0) > 255 ? contextNormalized?.substring(0, 254) : contextNormalized,
        }).catch(saveError => {
            console.error(`Failed to save error log to database`, saveError)
        })
    }

    getLastErrors(limit:number){
        return ErrorLog.findAll({ order:[['id','desc']], limit})
    }
}