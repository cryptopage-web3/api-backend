import { Network } from 'alchemy-sdk';
import { ChainId } from '../../modules/transactions/types';

const chainMap = {
    [ChainId.goerli]: Network.ETH_GOERLI,
    [ChainId.mumbai]: Network.MATIC_MUMBAI,
    [ChainId.matic]: Network.MATIC_MAINNET
}

export function getAlchemyNetwork(chain:ChainId):Network{
    if(chainMap[chain]){
        return chainMap[chain]
    }

    throw new Error(`Network not found for chain '${chain}'`)
}

export function buildAlchemyChainApiKeyVarname(chain:ChainId):string {
    return `ALCHEMY_API_KEY_${chain.toUpperCase()}`
}