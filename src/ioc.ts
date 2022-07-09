import { Container } from "inversify"
import { IDS } from './types/index';
import { envToString } from './util/env-util';
import { EtherscanApi } from './services/etherscan/index';

//autoload controllers
import './controller/transactions-controller'

import { EthTransactionManager } from './modules/transactions/eth';
import { ChainId } from './modules/transactions/types';

export const container = new Container();

container.bind(IDS.SERVICE.EtherscanApi).toConstantValue(() =>{
    return new EtherscanApi(envToString('ETHERSCAN_API_KEY'));
})

container.bind(IDS.MODULES.TransactionManager).to(EthTransactionManager).inSingletonScope().whenTargetNamed(ChainId.eth)
container.bind(IDS.MODULES.TransactionManager).toConstantValue(require('./modules/transactions/bsc')).whenTargetNamed(ChainId.bsc)
container.bind(IDS.MODULES.TransactionManager).toConstantValue(require('./modules/transactions/matic')).whenTargetNamed(ChainId.matic)
container.bind(IDS.MODULES.TransactionManager).toConstantValue(require('./modules/transactions/sol')).whenTargetNamed(ChainId.sol)
container.bind(IDS.MODULES.TransactionManager).toConstantValue(require('./modules/transactions/tron')).whenTargetNamed(ChainId.tron)

container.bind(IDS.MODULES.TransactionManagerFactory).toAutoNamedFactory(IDS.MODULES.TransactionManager)