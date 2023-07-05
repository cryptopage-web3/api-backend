import { injectable } from 'inversify';
import { SinonStub } from 'sinon';
import { ChainId } from '../../src/modules/transactions/types';

class Contract {
    methods:Object

    constructor(methods?: ContractParams){
        this.methods = {}

        if(methods){
            Object.keys(methods).forEach( methodName =>{
                const conf = methods[methodName],
                    methodStub = conf.method
                
                methodStub.returns({call: conf.call})

                this.methods[methodName] = methodStub
            })
        }
        
    }
}

@injectable()
export class TestWeb3Mock {
    eth = {
        Contract: Contract,
        getBlock:function(){}
    }
}

export function testWeb3ContractFactory(opts?:FactoryParams){
    return (abi, contractAddress:string, chainId:ChainId) => { 
        if(opts?.[contractAddress]){
            return new Contract(opts?.[contractAddress])
        }
        
        throw new Error(`Contract address ${contractAddress} not registered`)
    }
}

type ContractMethod = {
    method: SinonStub,
    call: SinonStub
}

type ContractParams = {
    [methodName:string]: ContractMethod
}

type FactoryParams = {
    [contractAddress:string]: ContractParams
}