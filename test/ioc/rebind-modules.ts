import { Container } from "inversify";
import { IDS } from '../../src/types/index';
import { TestAxiosMock } from '../mock/test-axios-mock';
import { TestWeb3Mock, testWeb3ContractFactory } from '../mock/test-web3-mock';
import { ChainId } from '../../src/modules/transactions/types';
import { getChainRpc } from '../../src/enums/chains';
import { testAlchemyMockFactory } from '../mock/test-alchemy-mock';
import { TestErrorLogRepoMock } from '../mock/test-error-log-repo-mock';

const web3Mocks = {}

export function rebindModules(container: Container){
    container.rebind(IDS.NODE_MODULES.axios).toConstantValue(TestAxiosMock)
    container.rebind(IDS.NODE_MODULES.web3Factory).toFactory(context => (chain:ChainId) =>{
        const key = `web3_${chain}`

        let instance

        if(!context.container.isBound(key)){
            getChainRpc(chain)
            instance = new TestWeb3Mock()
            context.container.bind(key).toConstantValue(instance)
        } else {
            instance = context.container.get(key)
        }

        return instance
    })
    container.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory())
    container.rebind(IDS.SERVICE.AlchemySdkFactory).toFactory(testAlchemyMockFactory)
    container.rebind(IDS.ORM.REPO.ErrorLogRepo).to(TestErrorLogRepoMock)
    container.rebind(IDS.CONFIG.EnableNftCache).toConstantValue(true);
}

export function resetWeb3MockInstances(){
    Object.keys(web3Mocks).forEach(key => ()=>{
        const mock:TestWeb3Mock = web3Mocks[key]

        delete web3Mocks[key]
    })
}