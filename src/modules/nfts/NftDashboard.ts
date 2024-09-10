import { inject, injectable } from "inversify";
import { PostStatisticRepo } from "../../orm/repo/post-statistic-repo";
import { IDS } from "../../types";

@injectable()
export class NftDashboard {
    @inject(IDS.ORM.REPO.PostStatisticRepo) _repo: PostStatisticRepo

    async getPostsWithCommentsTop(chain, pageNumber: number, pageSize:number){
        const items = await this._repo.getPostsWithCommentsTop(chain, pageNumber, pageSize)

        return items.map( i =>({
            tokenId: i.postId,
            commentsCount: i.totalCommentsCount
        }));
    }

    async getLastPosts(chain, pageNumber: number, pageSize:number){
        const items = await this._repo.getLastPosts(chain, pageNumber, pageSize)

        return items.map( i =>({
            tokenId: i.postId,
            commentsCount: i.totalCommentsCount
        }));
    }
}