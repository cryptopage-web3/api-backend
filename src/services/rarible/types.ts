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

export interface OptsCollectionDirPath {
    rootDirName?:string
    blockchain:string
}

export interface OptsCollectionFilePath extends OptsCollectionDirPath  {
    fileName:string
}

export type OptsCollectionPath = OptsCollectionDirPath | OptsCollectionFilePath