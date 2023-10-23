import { injectable } from "inversify";
import { PostStatistic } from "../model/post-statistic";

@injectable()
export class PostStatisticRepo {
    getDashboard(chain, pageNumber, pageSize){
        return PostStatistic.findAll({
            where:{ chain}, 
            limit: pageSize, 
            offset: (pageNumber - 1) * pageSize,
            order:[['totalCommentsCount','DESC']]
        })
    }
}