import { Network } from 'alchemy-sdk';
import { ChainId } from '../../modules/transactions/types';

export function getAlchemyNetwork(chain:ChainId):Network{
    if(chain == ChainId.goerli){
        return Network.ETH_GOERLI
    }

    throw new Error(`Network not found for chain '${chain}'`)
}

export function buildAlchemyChainApiKeyVarname(chain:ChainId):string {
    return `ALCHEMY_API_KEY_${chain.toUpperCase()}`
}