import { injectable } from "inversify";
import { PostStatistic } from "../model/post-statistic";
import { Op } from "sequelize";

@injectable()
export class PostStatisticRepo {
    async getPostsWithCommentsTop(chain, pageNumber, pageSize){
        return PostStatistic.findAll({
            where:{ chain, totalCommentsCount:{[Op.gt]:0}}, 
            limit: pageSize, 
            offset: (pageNumber - 1) * pageSize,
            order:[['totalCommentsCount','DESC'],['id','DESC']]
        })
    }

    async getLastPosts(chain, pageNumber, pageSize){
        return PostStatistic.findAll({
            where:{ chain, }, 
            limit: pageSize, 
            offset: (pageNumber - 1) * pageSize,
            order:[['id','DESC']]
        })
    }
}