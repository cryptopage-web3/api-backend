import { Blockchains } from "../services/rarible/types"

export interface Env {
    NODE_ENV: 'test' | 'production' | 'development'
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
    GOERLI_API_KEY: string

    SWAGGER_LOCAL_SERVER_FIRST: string | undefined

    PREVENT_LOG_ERRORS: 'yes' | 'no' | undefined

    ALCHEMY_API_KEY_GOERLI: string

    API_RATE_LIMIT: string

    NFT_DETAILS_CACHE_TTL_IN_MINUTES: string | undefined

    WEB3_RPC_URL_GOERLI: string
}

export type EnvVarName = keyof Env

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}

export {}