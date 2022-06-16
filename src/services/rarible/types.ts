export enum Blockchains {
    ETHEREUM="ETHEREUM",
    POLYGON="POLYGON", 
    FLOW="FLOW", 
    TEZOS="TEZOS", 
    SOLANA="SOLANA", 
    IMMUTABLEX="IMMUTABLEX"
}

export interface OptsGetAllCollections {
    size: number
    blockchains?: Blockchains
    continuation?: string | undefined
}


export interface OptsGetCollectionItems {
    collection: string
    continuation?: string | undefined
    size: number
}

export interface OptsCollectionDirPath {
    rootDirName?:string
    blockchain:string
}

export interface OptsCollectionFilePath extends OptsCollectionDirPath  {
    fileName:string
}

export type OptsCollectionPath = OptsCollectionDirPath | OptsCollectionFilePath

export interface OptsNftItemDirPath {
    rootDirName:string
    blockchain:string
    collectionId?: string
}

export interface OptsNftItemFilePath extends OptsNftItemDirPath  {
    fileName:string
}

export type OptsNftItemPath = OptsNftItemDirPath | OptsNftItemFilePath

export type NftItemContinue = {offset?:number,collection?:{[key: number]:string | undefined, bulkCounter: number}}

export type NftItemFilesIterator = IteratorResult<{items:any[], collection:string}>