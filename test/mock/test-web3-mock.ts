import { injectable } from 'inversify';

class Contract {
    methods:Object

    constructor(methods){
        this.methods = methods
    }
}

@injectable()
export class TestWeb3Mock {
    eth = {
        Contract: Contract,
        getBlock:function(){}
    }
}

export function testEthContractFactory(methods?){
    return () => new Contract(methods)
}