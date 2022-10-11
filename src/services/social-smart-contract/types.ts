export interface ISocialSmartContract {
    getCommentCount(tokenId: string):Promise<number>
    getComments(tokenId: string):Promise<ISocialComment[]>
}

export interface ISocialComment {
    ipfsHash: string
    creator: string
    _owner: string
    price: string
    isUp: boolean
    isDown: boolean
    isView: boolean
}