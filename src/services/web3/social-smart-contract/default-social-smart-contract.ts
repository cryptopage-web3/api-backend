import { injectable } from 'inversify';
import { ICommunity, ISocialPost } from './types';

@injectable()
export class DefaultSocialSmartContract implements ICommunity{
    async getCommentCount(tokenId: string): Promise<number> {
        return 0
    }

    async getComments(contractAddress: string, tokenId: string) {
        return []
    }

    async readPostForContract(contractAddress: string, post: string) {
        return {} as ISocialPost
    }
}