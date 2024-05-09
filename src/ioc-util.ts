import { interfaces, namedConstraint, traverseAncerstors } from "inversify"
import { ChainId } from "./modules/transactions/types"

export function getChainIdFromAncestor(request: interfaces.Request):ChainId | undefined {
    const parent = request.parentRequest

    if(parent == null){
        return
    }

    const name = parent.target.getNamedTag()?.value

    if(name !== undefined && name in ChainId){
        return name as ChainId
    }

    return getChainIdFromAncestor(parent)
}

export function getChainIdFromAncestorStrict(request: interfaces.Request): ChainId {
    const chain = getChainIdFromAncestor(request);

    if(!chain){
        throw new Error(`Failed to get chainId`)
    }

    return chain
}

export function injectChainDecorator(context: interfaces.Context, instance): interfaces.Next {
    if(typeof instance['setChainId'] !== 'function'){
        throw new Error(`${instance.constructor.name} does not have implemented method 'setChainId'`)
    }

    const chainId = getChainIdFromAncestor(context.currentRequest)
    //console.log('set chain id', chainId, context.currentRequest.serviceIdentifier)
    if(!chainId){
        throw new Error(`Failed to find chainId for ${instance.constructor.name}`)
    }

    instance.setChainId(chainId)

    return instance
    
}

export const whenNamedChainOrAncestorChainIs = (chain:ChainId) => (request: interfaces.Request) => {
    return namedConstraint(chain)(request) || traverseAncerstors(request, namedConstraint(chain))
}