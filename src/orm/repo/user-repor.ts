import { injectable } from "inversify";
import { User } from "../model/user";

@injectable()
export class UserRepo {
    async log(address:string, ip:string){
        if(await User.findOne({where:{ address }})){
            return
        }

        await User.create({
            address,
            ip
        })
    }

    getNewUsers(cnt: number = 10){
        return User.findAll({order:[['id','desc']], limit: cnt})
    }
}