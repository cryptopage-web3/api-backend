export const IDS = {
    CONFIG:{
        EtherscanApiKey:Symbol('EtherscanApiKey'),
        Web3RpcFactory: Symbol('Web3RpcFactory')
    },
    CACHE:{
        PriceCache: Symbol('PriceCache')
    },
    MODULES:{
        TransactionManager: Symbol('TransactionManager'),
        TransactionManagerFactory: Symbol('TransactionManagerFactory'),
        NftsManager: Symbol('NftsManager'),
        NftsManagerFactory: Symbol('NftsManagerFactory'),
        TokenManager: Symbol('TokenManager'),
        TokenManagerFactory: Symbol('TokenManagerFactory'),
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
        WEB3:{
            Web3Manager: Symbol('Web3Manager'),
        }
    },
    NODE_MODULES:{
        axios: Symbol('axios'),
        web3: Symbol('web3')
    },
    ORM:{
        REPO:{
            ContractDetailsRepo: Symbol('ContractDetailsRepo'),
            NftTokenDetailsRepo: Symbol('NftTokenDetailsRepo'),
        }
    }
}

export class ApiError extends Error {}