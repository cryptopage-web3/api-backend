export interface ISocialSmartContract {
    getCommentCount(tokenId: string):Promise<number>
}