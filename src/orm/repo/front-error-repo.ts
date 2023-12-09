import { injectable } from "inversify";
import { FrontError } from "../model/front-error";

@injectable()
export class FrontErrorsRepo {
    saveError(message:string, callStack:string ,ip:string){
        return FrontError.create({
            message,
            callStack,
            ip
        })
    }
}