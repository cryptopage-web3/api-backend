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
    ALCHEMY_API_KEY_MUMBAI: string
    ALCHEMY_API_KEY_MATIC: string

    API_RATE_LIMIT: string

    NFT_DETAILS_CACHE_TTL_IN_MINUTES: string | undefined

    WEB3_RPC_URL_GOERLI: string
    WEB3_RPC_URL_MUMBAI: string
    WEB3_RPC_URL_MATIC: string

    POLYSCAN_API_KEY: string

    BSCSCAN_API_KEY: string

    COVALENT_API_KEY: string

    UNMARSHAL_API_KEY: string

    ENABLE_NFT_CACHE: string | undefined

    COINGECKO_TOKEN_IDS_PATH: string | undefined
    COINGECKO_PRICE_CACHE_TTL_IN_SECONDS: string | undefined
    ALLOWED_FRONT_ERROR_REFFERER: string

    COMMENTS_SYNC_PRIVATE_KEY: string
    DEFAULT_ALLOWED_REFFERER: string
    DEBANK_API_KEY: string
}

export type EnvVarName = keyof Env

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}

export {}