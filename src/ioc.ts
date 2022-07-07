import { Container } from "inversify"
import { IDS } from './types/index';
import { envToString } from './util/env-util';
import { EtherscanApi } from './services/etherscan/index';

import './controller/default-controller'

export const container = new Container();

container.bind(IDS.SERVICE.EtherscanApi).toDynamicValue(context =>{
    return new EtherscanApi(envToString('ETHERSCAN_API_KEY'));
})