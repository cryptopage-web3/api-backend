import { injectable } from 'inversify';
import { ErrorLog } from '../model/error-log';

@injectable()
export class ErrorLogRepo {
    async log(err:string, descr?: string, context?: string){
        ErrorLog.create({
            key: err,
            descr: (descr?.length || 0) > 400 ? descr?.substring(0, 399) : descr,
            context: (context?.length || 0) > 255 ? context?.substring(0, 254) : context,
        }).catch(saveError => {
            console.error(`Failed to save error log to database`, saveError)
        })
    }
}