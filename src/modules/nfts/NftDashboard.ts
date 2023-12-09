import { inject, injectable } from "inversify";
import { PostStatisticRepo } from "../../orm/repo/post-statistic-repo";
import { IDS } from "../../types";

@injectable()
export class NftDashboard {
    @inject(IDS.ORM.REPO.PostStatisticRepo) _repo: PostStatisticRepo

    async getTokensDasboard(chain, pageNumber: number, pageSize:number){
        const items = await this._repo.getDashboard(chain, pageNumber, pageSize)

        return items.map( i =>({
            tokenId: i.postId,
            commentsCount: i.totalCommentsCount
        }));
    }
}