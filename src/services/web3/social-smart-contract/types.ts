export interface ISocialSmartContract {
    getCommentCount(tokenId: string):Promise<number>
    getComments(tokenId: string):Promise<ISocialComment[]>
    readPostForContract(contractAddress:string, tokenId:string): Promise<ISocialPost>
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

export interface IBaseSocialPost {
    isEncrypted: boolean
    accessPrice: string | number
    accessDuration: string | number
}

export interface ISocialPost extends IBaseSocialPost {
    ipfsHash: string
    creator: string
    upCount: number
    downCount: number
}