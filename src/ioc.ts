import { Container } from "inversify"
import { IDS } from './types/index';
import { envToString } from './util/env-util';
import { EtherscanApi } from './services/etherscan/etherscan-api';

//autoload controllers
import './controller/autoload'

import { EthTransactionManager } from './modules/transactions/eth';
import { ChainId } from './modules/transactions/types';
import { UnmarshalTransactionsManager } from './modules/transactions/UnmarshalTransactionsManager';
import { UnmarshalNftsManager } from './modules/nfts/UnmarshalNftsManager';
import { TronGridApi } from './services/trongrid/trongrid-api';
import { TronGridApiTransactionsManager } from './modules/transactions/tron';
import { SolScanApi } from './services/solscan/solscan-api';
import { SolscanTtransactionsManager } from './modules/transactions/sol';
import { UnmarshalApi } from './services/unmarshal/UnmarhalApi';
import { UnmarshalTokenManager } from './modules/tokens/UnmarshalTokenManager';
import { CovalentApi } from './services/covalent/covalent-api';
import { CovalentTokenManager } from './modules/tokens/sol';
import { TronscanTokenManager } from './modules/tokens/tron';
import axios from 'axios';
import { ContractDetailsRepo } from './orm/repo/contract-details-repo';

export const container = new Container();

container.bind(IDS.NODE_MODULES.axios).toConstantValue(axios)

container.bind(IDS.SERVICE.EtherscanApi).toConstantValue(
    new EtherscanApi(envToString('ETHERSCAN_API_KEY'))
)
container.bind(IDS.SERVICE.TrongridApi).to(TronGridApi).inSingletonScope()
container.bind(IDS.SERVICE.SolScanApi).to(SolScanApi).inSingletonScope()
container.bind(IDS.SERVICE.UnmarshalApi).to(UnmarshalApi).onActivation((context, instance:UnmarshalApi) =>{
    const chain: ChainId = context.plan.rootRequest?.target.getNamedTag()?.value as any;
    if(!chain){
        throw new Error(`failed to init UnmarshalApi, Invalid chain: ${chain}`)
    }

    instance.initConfig(chain)
    return instance
})
container.bind(IDS.SERVICE.CovalentApi).to(CovalentApi)
container.bind(IDS.SERVICE.TronscanApi).to(TronscanTokenManager)

container.bind(IDS.MODULES.TransactionManager)
    .to(EthTransactionManager).inSingletonScope()
    .whenTargetNamed(ChainId.eth)
container.bind(IDS.MODULES.TransactionManager)
    .to(UnmarshalTransactionsManager).inSingletonScope()
    .whenTargetNamed(ChainId.bsc)
container.bind(IDS.MODULES.TransactionManager)
    .to(UnmarshalTransactionsManager).inSingletonScope()
    .whenTargetNamed(ChainId.matic)
container.bind(IDS.MODULES.TransactionManager)
    .to(SolscanTtransactionsManager).inSingletonScope()
    .whenTargetNamed(ChainId.sol)
container.bind(IDS.MODULES.TransactionManager)
    .to(TronGridApiTransactionsManager).inSingletonScope()
    .whenTargetNamed(ChainId.tron)
container.bind(IDS.MODULES.TransactionManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.TransactionManager)

container.bind(IDS.MODULES.NftsManager)
    .to(UnmarshalNftsManager).inSingletonScope()
    .whenTargetNamed(ChainId.bsc)
container.bind(IDS.MODULES.NftsManager)
    .to(UnmarshalNftsManager).inSingletonScope()
    .whenTargetNamed(ChainId.matic)
container.bind(IDS.MODULES.NftsManager)
    .to(UnmarshalNftsManager).inSingletonScope()
    .whenTargetNamed(ChainId.eth)
container.bind(IDS.MODULES.NftsManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.NftsManager)

container.bind(IDS.MODULES.TokenManager)
    .to(UnmarshalTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.eth)
container.bind(IDS.MODULES.TokenManager)
    .to(UnmarshalTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.bsc)
container.bind(IDS.MODULES.TokenManager)
    .to(UnmarshalTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.matic)
container.bind(IDS.MODULES.TokenManager)
    .to(CovalentTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.sol)
container.bind(IDS.MODULES.TokenManager)
    .to(TronscanTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.tron)
container.bind(IDS.MODULES.TokenManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.TokenManager)

container.bind(IDS.ORM.REPO.ContractDetailsRepo).to(ContractDetailsRepo)