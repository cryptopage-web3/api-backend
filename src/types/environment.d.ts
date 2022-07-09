import { Blockchains } from "../services/rarible/types"

export interface Env {
    PORT: string
    HOST: string | undefined

    DB_HOST: string
    DB_USER: string 
    DB_PASSWORD: string
    DB_NAME: string 
    DB_PORT: string

    UPDATE_NFT_COLLECTION_CRON_READ_SIZE: string
    UPDATE_NFT_COLLECTION_BLOCKCHAIN: Blockchains

    ETHERSCAN_API_KEY: string
}

export type EnvVarName = keyof Env

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}

export {}