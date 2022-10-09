import { injectable } from 'inversify';
import { ISocialSmartContract } from './types';

@injectable()
export class DefaultSocialSmartContract implements ISocialSmartContract{
    async getCommentCount(tokenId: string): Promise<number> {
        return 0
    }
}