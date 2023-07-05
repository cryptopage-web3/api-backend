import { injectable, interfaces } from 'inversify';
import { getChainIdFromAncestor } from '../../src/ioc-util';
import { ChainId } from '../../src/modules/transactions/types';

@injectable()
export class TestAlchemyMock {
    nft = {
        getNftsForOwner: function(){},
        getNftMetadata: function(...args){}
    }
    core = {
        getAssetTransfers: function(){},
        getTokenBalances: address => {},
        getTokenMetadata: address => {}
    }
}


export const testAlchemyMockFactory = (context:interfaces.Context) => (chain?:ChainId) =>{
    if(!chain){
        chain = getChainIdFromAncestor(context.currentRequest)
    }

    if(!chain){
        throw new Error(`Undefined chain for alchemy`)
    }

    const key = 'alchemy'

    if(!context.container.isBoundNamed(key, chain)){
        context.container.bind(key)
            .toConstantValue(new TestAlchemyMock())
            .whenTargetNamed(chain)
    }

    return context.container.getNamed(key, chain)
}