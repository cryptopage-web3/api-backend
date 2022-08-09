export const IDS = {
    CONFIG:{
        EtherscanApiKey:Symbol('EtherscanApiKey')
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
    },
    NODE_MODULES:{
        axios: Symbol('axios')
    },
    ORM:{
        REPO:{
            ContractDetailsRepo: Symbol('ContractDetailsRepo')
        }
    }
}