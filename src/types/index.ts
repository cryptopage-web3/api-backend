import { ChainId } from '../modules/transactions/types';
import { envToArray } from '../util/env-util';
export const IDS = {
    CONFIG:{
        Web3RpcUrl: Symbol('Web3RpcUrl'),
        EtherscanApiKey:Symbol('EtherscanApiKey'),
        GoerliApiKey:Symbol('GoerliApiKey'),
        Web3RpcFactory: Symbol('Web3RpcFactory'),
        EnableNftCache: Symbol('EnableNftCache'),
        PageToken: Symbol('PageToken'),
        COINGECKO_PRICE_CACHE_TTL_IN_SECONDS: Symbol('COINGECKO_PRICE_CACHE_TTL_IN_SECONDS'),
        NftReadAsProxy:{
            ContractAddress: Symbol('NftReadAsProxyContractAddress'),
            Abi: Symbol('NftReadAsProxyAbi'),
        },
        DebankApiKey: Symbol('DebankApiKey'),
        SmartContractsConf: Symbol('SmartContractsConf'),
    },
    UTIL:{
        Logger:Symbol('logger')
    },
    CACHE:{
        PriceCache: Symbol('PriceCache')
    },
    MODULES:{
        TransactionManager: Symbol('TransactionManager'),
        TransactionManagerFactory: Symbol('TransactionManagerFactory'),
        NftsManager: Symbol('NftsManager'),
        NftsManagerFactory: Symbol('NftsManagerFactory'),
        NftCache: Symbol('NftsCache'),
        TokenManager: Symbol('TokenManager'),
        TokenManagerFactory: Symbol('TokenManagerFactory'),
        NftDashboard: Symbol('NftDasboard'),
        NftDashboardFactory: Symbol('NftDasboardFactory'),
    },
    SERVICE:{
        EtherscanApi: Symbol('EtherscanApi'),
        TrongridApi: Symbol('TronGridApi'),
        UnmarshalApi: Symbol('UnmarshalApi'),
        UnmarshalApiHelper: Symbol('UnmarshalApiHelper'),
        SolScanApi: Symbol('SolScanApi'),
        CovalentApi: Symbol('CovalentApi'),
        TronscanApi: Symbol('TronscanApi'),
        GoerliScanApi: Symbol('GoerliScanApi'),
        AlchemySdkFactory: Symbol('AlchemySdkFactory'),
        AlchemySdk: Symbol('AlchemySdk'),
        WEB3:{
            Web3Manager: Symbol('Web3Manager'),
            Web3ManagerFactory: Symbol('Web3ManagerFactory'),
            CommunityWeb3SmartContract: Symbol('CommunityWeb3SmartContract'),
            ContractFactory: Symbol('Web3ContractFactory'),
            Web3Util: Symbol('Web3Util'),
        },
        CryptoPageCommunity: Symbol('CryptoPageCommunity'),
        CoingeckoApi: Symbol('CoingeckoApi'),
        CoingeckoPriceCache: Symbol('CoingeckoPriceCache'),
        DebankApi: Symbol(`DebankApi`),
    },
    NODE_MODULES:{
        axios: Symbol('axios'),
        web3Factory: Symbol('web3Factory'),
        web3: Symbol('web3'),
    },
    ORM:{
        REPO:{
            ContractDetailsRepo: Symbol('ContractDetailsRepo'),
            NftTokenDetailsRepo: Symbol('NftTokenDetailsRepo'),
            ErrorLogRepo: Symbol('ErrorLogRepo'),
            BlockDetailsRepo: Symbol('BlockDetailsRepo'),
            FrontErrorsRepo: Symbol('FrontErrorsRepo'),
            PostStatisticRepo: Symbol('PostStatisticRepo'),
            UserRepo: Symbol('UserRepo'),
        }
    }
}

export class ApiError extends Error {}

export interface IChainContext {
    setChainId(chainId: ChainId)
}

export const defaultAllowedRefferers = envToArray('DEFAULT_ALLOWED_REFFERER',['app.crypto.page','api-m.crypto.page','localhost:3000'])