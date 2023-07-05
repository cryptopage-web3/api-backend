import { interfaces } from "inversify"
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