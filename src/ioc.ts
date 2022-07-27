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

export const container = new Container();

container.bind(IDS.SERVICE.EtherscanApi).toConstantValue(
    new EtherscanApi(envToString('ETHERSCAN_API_KEY'))
)
container.bind(IDS.SERVICE.TrongridApi).to(TronGridApi).inSingletonScope()

container.bind(IDS.MODULES.TransactionManager)
    .to(EthTransactionManager).inSingletonScope().whenTargetNamed(ChainId.eth)
container.bind(IDS.MODULES.TransactionManager)
    .toConstantValue(new UnmarshalTransactionsManager(ChainId.bsc))
    .whenTargetNamed(ChainId.bsc)
container.bind(IDS.MODULES.TransactionManager)
    .toConstantValue(new UnmarshalTransactionsManager(ChainId.matic))
    .whenTargetNamed(ChainId.matic)
container.bind(IDS.MODULES.TransactionManager)
    .toConstantValue(require('./modules/transactions/sol')).whenTargetNamed(ChainId.sol)
container.bind(IDS.MODULES.TransactionManager)
    .to(TronGridApiTransactionsManager).inSingletonScope().whenTargetNamed(ChainId.tron)
container.bind(IDS.MODULES.TransactionManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.TransactionManager)

container.bind(IDS.MODULES.NftsManager)
    .toConstantValue(new UnmarshalNftsManager(ChainId.bsc))
    .whenTargetNamed(ChainId.bsc)
container.bind(IDS.MODULES.NftsManager)
    .toConstantValue(new UnmarshalNftsManager(ChainId.matic))
    .whenTargetNamed(ChainId.matic)
container.bind(IDS.MODULES.NftsManager)
    .toConstantValue(new UnmarshalNftsManager(ChainId.eth))
    .whenTargetNamed(ChainId.eth)
container.bind(IDS.MODULES.NftsManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.NftsManager)