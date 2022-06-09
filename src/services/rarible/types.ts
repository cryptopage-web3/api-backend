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
    continuation?: string
}

