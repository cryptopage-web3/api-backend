import { Container } from "inversify";
import { IDS } from '../../src/types/index';
import { TestAxiosMock } from '../mock/test-axios-mock';
import { TestWeb3Mock, testEthContractFactory } from '../mock/test-web3-mock';
import { ChainId } from '../../src/modules/transactions/types';
import { getChainRpc } from '../../src/enums/chains';
import { testAlchemyMockFactory } from '../mock/test-alchemy-mock';
import { TestErrorLogRepoMock } from '../mock/test-error-log-repo-mock';

const web3Mocks = {}

export function rebindModules(container: Container){
    container.rebind(IDS.NODE_MODULES.axios).toConstantValue(TestAxiosMock)
    container.rebind(IDS.NODE_MODULES.web3Factory).toFactory(context => (chain:ChainId) =>{
        if(!web3Mocks[chain]){
            getChainRpc(chain)
            web3Mocks[chain] = new TestWeb3Mock()
        }
        return web3Mocks[chain]
    })
    container.rebind(IDS.SERVICE.WEB3.EthContractFactory).toFactory(context => testEthContractFactory())
    container.rebind(IDS.SERVICE.AlchemySdkFactory).toFactory(context => testAlchemyMockFactory)
    container.rebind(IDS.ORM.REPO.ErrorLogRepo).to(TestErrorLogRepoMock)
}