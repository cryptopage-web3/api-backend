import { injectable } from 'inversify';
import { ErrorLog } from '../model/error-log';

@injectable()
export class ErrorLogRepo {
    async log(err:string){
        ErrorLog.create({key: err}).catch(saveError => {
            console.error(`Failed to save error log to databse`, saveError)
        })
    }
}