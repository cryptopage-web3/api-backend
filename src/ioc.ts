import { Container, interfaces } from "inversify"
import { IDS } from './types/index';
import { envToString } from './util/env-util';
import { EtherscanApi } from './services/etherscan/etherscan-api';

//autoload controllers
import './controller/autoload'

import { EthTransactionManager } from './modules/transactions/eth';
import { ChainId } from './modules/transactions/types';
import { UnmarshalTransactionsManager } from './modules/transactions/UnmarshalTransactionsManager';
import { UnmarshalNftsManager } from './modules/nfts/UnmarshalNftsManager';
import { TronGridApi } from './services/trongrid/trongrid-api';
import { TronGridApiTransactionsManager } from './modules/transactions/tron';
import { SolScanApi } from './services/solscan/solscan-api';
import { GoerliScanApi } from './services/etherscan/goerliscan-api';
import { SolscanTtransactionsManager } from './modules/transactions/sol';
import { GoerliscanTtransactionsManager } from './modules/transactions/goerli';
import { UnmarshalApi } from './services/unmarshal/UnmarhalApi';
import { UnmarshalTokenManager } from './modules/tokens/UnmarshalTokenManager';
import { GoerliScanTokenManager } from './modules/tokens/goerli';
import { GoerliScanNFTsManager } from './modules/nfts/goerli';
import { CovalentApi } from './services/covalent/covalent-api';
import { CovalentTokenManager } from './modules/tokens/sol';
import { TronscanTokenManager } from './modules/tokens/tron';
import axios from 'axios';
import { ContractDetailsRepo } from './orm/repo/contract-details-repo';
import { PriceCache } from './cache/coins';
import { UnmarshalApiHelper } from './services/unmarshal/helper';
import { NftTokenDetailsRepo } from './orm/repo/nft-token-details-repo';
import { INftsManager } from './modules/nfts/types';
import Web3 from 'web3';
import { getChainRpc } from './enums/chains';
import { EthWeb3Manager } from './services/web3/eth-web3-manager';
import { NftCache } from './modules/nfts/NftCache';
import { GoerliSocialSmartContract } from './services/social-smart-contract/goerli-social-smart-contract';
import { DefaultSocialSmartContract } from './services/social-smart-contract/default-social-smart-contract';
import { goerliSocialAbi } from './services/social-smart-contract/goerli-social-abi';

export const container = new Container();

container.bind(IDS.NODE_MODULES.axios).toConstantValue(axios)
container.bind(IDS.NODE_MODULES.web3Factory)
    .toFactory(context => (chain:ChainId) => { 
        console.log(`created web3 for ${chain}`)
        return new Web3(getChainRpc(chain)) 
    })
container.bind(IDS.NODE_MODULES.web3).toDynamicValue(context => {
    const chain:ChainId | undefined = getChainIdFromAncestor(context.currentRequest)
    if(!chain){
        throw new Error(`Failed to init web3. Invalid chainid ${chain}`)
    }
    const factory:Function = context.container.get(IDS.NODE_MODULES.web3Factory)

    return factory(chain)
})

container.bind(IDS.SERVICE.WEB3.Web3Manager)
    .to(EthWeb3Manager)
    .inSingletonScope().whenAnyAncestorNamed(ChainId.eth)
container.bind(IDS.SERVICE.WEB3.Web3Manager)
    .to(EthWeb3Manager)
    .inSingletonScope().whenAnyAncestorNamed(ChainId.goerli)
container.bind(IDS.SERVICE.WEB3.Web3Manager)
    .to(EthWeb3Manager)
    .inSingletonScope().whenAnyAncestorNamed(ChainId.matic)
container.bind(IDS.SERVICE.WEB3.Web3Manager)
    .to(EthWeb3Manager)
    .inSingletonScope().whenAnyAncestorNamed(ChainId.bsc)
    /*
container.bind(IDS.SERVICE.WEB3.Web3Manager)
    .to(DefaultWebManager).when((request)=> {
        const name = request.parentRequest?.target.getNamedTag()?.value as any
        const implementedChains = [ChainId.eth, ChainId.bsc, ChainId.matic,ChainId.goerli]
        
        return implementedChains.indexOf(name) === -1
    })*/
container.bind(IDS.SERVICE.WEB3.EthContract).toDynamicValue((context) => {
    const web3Factory:Function = context.container.get(IDS.NODE_MODULES.web3Factory)
    const web3:Web3 = web3Factory(ChainId.goerli)

    return new web3.eth.Contract(goerliSocialAbi as any[], '0x2d722a9853ac048ce220fadbf3cab45146d76af6')
}).whenAnyAncestorNamed(ChainId.goerli)

container.bind(IDS.CONFIG.EtherscanApiKey).toConstantValue(envToString('ETHERSCAN_API_KEY'))
container.bind(IDS.CONFIG.GoerliApiKey).toConstantValue(envToString('GOERLI_API_KEY'))

container.bind(IDS.CACHE.PriceCache).to(PriceCache)

container.bind(IDS.SERVICE.EtherscanApi).to(EtherscanApi).inSingletonScope()
container.bind(IDS.SERVICE.TrongridApi).to(TronGridApi).inSingletonScope()
container.bind(IDS.SERVICE.SolScanApi).to(SolScanApi).inSingletonScope()
container.bind(IDS.SERVICE.GoerliScanApi).to(GoerliScanApi).inSingletonScope()
container.bind(IDS.SERVICE.UnmarshalApi).to(UnmarshalApi).onActivation((context, instance:UnmarshalApi) =>{
    const chain: ChainId | undefined = getChainIdFromAncestor(context.currentRequest)
    if(!chain){
        throw new Error(`failed to init UnmarshalApi, Invalid chain: ${chain}`)
    }

    instance.initConfig(chain)
    return instance
})
container.bind(IDS.SERVICE.UnmarshalApiHelper).to(UnmarshalApiHelper)
container.bind(IDS.SERVICE.CovalentApi).to(CovalentApi)
container.bind(IDS.SERVICE.TronscanApi).to(TronscanTokenManager)

container.bind(IDS.SERVICE.SocialSmartContract)
    .to(GoerliSocialSmartContract)
    .inSingletonScope()
    .whenAnyAncestorNamed(ChainId.goerli)
container.bind(IDS.SERVICE.SocialSmartContract)
    .to(DefaultSocialSmartContract)
    .whenNoAncestorNamed(ChainId.goerli)

container.bind(IDS.MODULES.NftCache).to(NftCache)

container.bind(IDS.MODULES.TransactionManager)
    .to(EthTransactionManager).inSingletonScope()
    .whenTargetNamed(ChainId.eth)
container.bind(IDS.MODULES.TransactionManager)
    .to(UnmarshalTransactionsManager).inSingletonScope()
    .whenTargetNamed(ChainId.bsc)
container.bind(IDS.MODULES.TransactionManager)
    .to(UnmarshalTransactionsManager).inSingletonScope()
    .whenTargetNamed(ChainId.matic)
container.bind(IDS.MODULES.TransactionManager)
    .to(SolscanTtransactionsManager).inSingletonScope()
    .whenTargetNamed(ChainId.sol)
container.bind(IDS.MODULES.TransactionManager)
    .to(TronGridApiTransactionsManager).inSingletonScope()
    .whenTargetNamed(ChainId.tron)
container.bind(IDS.MODULES.TransactionManager)
    .to(GoerliscanTtransactionsManager).inSingletonScope()
    .whenTargetNamed(ChainId.goerli)
container.bind(IDS.MODULES.TransactionManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.TransactionManager)

function nftManagerDecorator(context: interfaces.Context, instance:INftsManager){
    instance._chain = context.plan.rootRequest?.target.getNamedTag()?.value as any

    if(!instance._chain){
        throw new Error(`NftsManager invalid chain: ${instance._chain}`)
    }

    return instance
}


container.bind(IDS.MODULES.NftsManager)
    .to(UnmarshalNftsManager).inSingletonScope()
    .whenTargetNamed(ChainId.bsc)
    .onActivation(nftManagerDecorator)
container.bind(IDS.MODULES.NftsManager)
    .to(UnmarshalNftsManager).inSingletonScope()
    .whenTargetNamed(ChainId.matic)
    .onActivation(nftManagerDecorator)
container.bind(IDS.MODULES.NftsManager)
    .to(UnmarshalNftsManager).inSingletonScope()
    .whenTargetNamed(ChainId.eth)
    .onActivation(nftManagerDecorator)
container.bind(IDS.MODULES.NftsManager)
    .to(GoerliScanNFTsManager).inSingletonScope()
    .whenTargetNamed(ChainId.goerli)
    .onActivation(nftManagerDecorator)
container.bind(IDS.MODULES.NftsManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.NftsManager)

container.bind(IDS.MODULES.TokenManager)
    .to(UnmarshalTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.eth)
container.bind(IDS.MODULES.TokenManager)
    .to(UnmarshalTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.bsc)
container.bind(IDS.MODULES.TokenManager)
    .to(UnmarshalTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.matic)
container.bind(IDS.MODULES.TokenManager)
    .to(CovalentTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.sol)
container.bind(IDS.MODULES.TokenManager)
    .to(TronscanTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.tron)
container.bind(IDS.MODULES.TokenManager)
    .to(GoerliScanTokenManager).inSingletonScope()
    .whenTargetNamed(ChainId.goerli)
container.bind(IDS.MODULES.TokenManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.TokenManager)

container.bind(IDS.ORM.REPO.ContractDetailsRepo).to(ContractDetailsRepo)
container.bind(IDS.ORM.REPO.NftTokenDetailsRepo).to(NftTokenDetailsRepo)

function getChainIdFromAncestor(request: interfaces.Request):ChainId | undefined {
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