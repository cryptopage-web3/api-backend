import { Container, interfaces } from "inversify"
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

export const container = new Container();

container.bind(IDS.SERVICE.EtherscanApi).toConstantValue(
    new EtherscanApi(envToString('ETHERSCAN_API_KEY'))
)
container.bind(IDS.SERVICE.TrongridApi).to(TronGridApi).inSingletonScope()
container.bind(IDS.SERVICE.SolScanApi).to(SolScanApi).inSingletonScope()
container.bind(IDS.SERVICE.UnmarshalApiFactory).toFactory(context => () => {
    return new UnmarshalApi(context.currentRequest.parentRequest?.target.getNamedTag()?.value as any)
})

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