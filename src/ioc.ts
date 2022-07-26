import { Container } from "inversify"
import { IDS } from './types/index';
import { envToString } from './util/env-util';
import { EtherscanApi } from './services/etherscan/etherscan-api';

//autoload controllers
import './controller/transactions-controller'

import { EthTransactionManager } from './modules/transactions/eth';
import { ChainId } from './modules/transactions/types';
import { UnmarshalTransactionsManager } from './modules/transactions/UnmarshalTransactionsManager';

export const container = new Container();

container.bind(IDS.SERVICE.EtherscanApi).toConstantValue(
    new EtherscanApi(envToString('ETHERSCAN_API_KEY'))
)

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
    .toConstantValue(require('./modules/transactions/tron')).whenTargetNamed(ChainId.tron)
container.bind(IDS.MODULES.TransactionManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.TransactionManager)