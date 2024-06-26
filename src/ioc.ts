import { Container, interfaces, namedConstraint, taggedConstraint, traverseAncerstors } from "inversify"
import { IDS } from './types/index';
import { envToBool, envToString, envToInt } from './util/env-util';
import { EtherscanApi } from './services/etherscan/etherscan-api';
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
import { GoerliNFTsManager } from './modules/nfts/goerli';
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
import { GoerliSocialSmartContract } from './services/web3/social-smart-contract/goerli-social-smart-contract';
import { DefaultSocialSmartContract } from './services/web3/social-smart-contract/default-social-smart-contract';
import { getAlchemyNetwork, buildAlchemyChainApiKeyVarname } from './services/alchemy/alchemy-util';
import { Alchemy } from "alchemy-sdk";
import { ErrorLogRepo } from './orm/repo/error-log-repo';
import { BlockDetailsRepo } from './orm/repo/block-details-repo';
import { getLogger } from "./util/logger";
import { Web3Util } from './services/web3/web3-util';
import { AlchemyTransactionsManager } from "./modules/transactions/AlchemyTransactionsManager";
import { AlchemyNftsManager } from "./modules/nfts/AlchemyNftsManager";
import { AlchemyTokenManager } from "./modules/tokens/AlchemyTokenManager";
import { pageTokenMumbai } from "./modules/tokens/types";
import { CoinGeckoApi } from "./services/coingecko/coingecko-api";
import { CoingeckoPriceCache } from "./services/coingecko/price-cache";
import { MumbaiCommunity } from "./services/web3/social-smart-contract/mumbai/mumbai-community";
import { mumbaiCommunityAbi, mumbaiNFTReadASProxyAbi } from "./services/web3/social-smart-contract/mumbai/abi";
import { getChainIdFromAncestor, injectChainDecorator, whenNamedChainOrAncestorChainIs } from "./ioc-util";
import { FrontErrorsRepo } from "./orm/repo/front-error-repo";
import { NftDashboard } from "./modules/nfts/NftDashboard";
import { PostStatisticRepo } from "./orm/repo/post-statistic-repo";
import { UserRepo } from "./orm/repo/user-repor";
import { DebankApi } from "./services/debank/DebankApi";
import { IChainConf, maticSmartContracts, mumbaiSmartContracts } from "./services/web3/social-smart-contract/constants";

export const container = new Container();

container.bind(IDS.UTIL.Logger).toDynamicValue(() => getLogger)

container.bind(IDS.NODE_MODULES.axios).toConstantValue(axios)
container.bind(IDS.NODE_MODULES.web3Factory)
    .toFactory(context => (chain:ChainId) => {
        return new Web3(new Web3.providers.HttpProvider( getChainRpc(chain), {timeout: 5000}))
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
    .when(request =>{
        const chain = getChainIdFromAncestor(request) || request.target.getNamedTag()?.value,
            allowedChains:string[] = [ChainId.matic, ChainId.mumbai];

        return !!chain && allowedChains.indexOf(chain) !== -1;
    })

container.bind(IDS.SERVICE.WEB3.Web3ManagerFactory)
    .toFactory(context => (chain:ChainId) =>{
        return container.getNamed(IDS.SERVICE.WEB3.Web3Manager, chain)
    })

container.onActivation(IDS.SERVICE.WEB3.Web3Manager, injectChainDecorator)

container.bind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => (abi: any[], contractAddress: string, chain?:ChainId) =>{
    const web3Factory:Function = context.container.get(IDS.NODE_MODULES.web3Factory)
    const web3:Web3 = web3Factory(chain || getChainIdFromAncestor(context.currentRequest))

    return new web3.eth.Contract(abi, contractAddress)
})

container.bind(IDS.SERVICE.WEB3.CommunityWeb3SmartContract).toDynamicValue((context) => {
    const chain:ChainId | undefined = getChainIdFromAncestor(context.currentRequest)
    if(!chain){
        throw new Error(`Failed to init CommunityWeb3SmartContract. Invalid chainid ${chain}`)
    }

    const contractFactory:Function = context.container.get(IDS.SERVICE.WEB3.ContractFactory),
        chainConf:IChainConf = context.container.getNamed(IDS.CONFIG.SmartContractsConf, chain)
    
    return contractFactory(mumbaiCommunityAbi as any[], chainConf.communityContract.address, chain)
})

container.bind(IDS.SERVICE.WEB3.Web3Util).to(Web3Util)

container.bind(IDS.CONFIG.EtherscanApiKey).toConstantValue(envToString('ETHERSCAN_API_KEY'))
container.bind(IDS.CONFIG.GoerliApiKey).toConstantValue(envToString('GOERLI_API_KEY'))
container.bind('ALCHEMY_API_KEY_GOERLI').toConstantValue(envToString('ALCHEMY_API_KEY_GOERLI'))
container.bind('ALCHEMY_API_KEY_MUMBAI').toConstantValue(envToString('ALCHEMY_API_KEY_MUMBAI'))
container.bind('ALCHEMY_API_KEY_MATIC').toConstantValue(envToString('ALCHEMY_API_KEY_MATIC'))

container.bind(IDS.CONFIG.EnableNftCache).toConstantValue(envToBool('ENABLE_NFT_CACHE', true))
container.bind(IDS.CONFIG.DebankApiKey).toConstantValue(envToString('DEBANK_API_KEY'))

container.bind(IDS.CONFIG.PageToken).toConstantValue(pageTokenMumbai).whenAnyAncestorNamed(ChainId.mumbai)
container.bind(IDS.CONFIG.PageToken).toConstantValue(pageTokenMumbai).whenAnyAncestorNamed(ChainId.matic)

//container.bind(IDS.CONFIG.Web3RpcUrl).toConstantValue(envToString('WEB3_RPC_URL_MUMBAI')).when(whenNamedChainOrAncestorChainIs(ChainId.mumbai))
//container.bind(IDS.CONFIG.Web3RpcUrl).toConstantValue(envToString('WEB3_RPC_URL_MATIC')).when(whenNamedChainOrAncestorChainIs(ChainId.matic))

container.bind(IDS.CONFIG.SmartContractsConf).toConstantValue(mumbaiSmartContracts).when(whenNamedChainOrAncestorChainIs(ChainId.mumbai))
container.bind(IDS.CONFIG.SmartContractsConf).toConstantValue(maticSmartContracts).when(whenNamedChainOrAncestorChainIs(ChainId.matic))

container.bind(IDS.CONFIG.COINGECKO_PRICE_CACHE_TTL_IN_SECONDS).toConstantValue(envToInt('COINGECKO_PRICE_CACHE_TTL_IN_SECONDS', 300))

container.bind(IDS.CACHE.PriceCache).to(PriceCache)

container.bind(IDS.SERVICE.EtherscanApi).to(EtherscanApi).inSingletonScope()
container.bind(IDS.SERVICE.TrongridApi).to(TronGridApi).inSingletonScope()
container.bind(IDS.SERVICE.SolScanApi).to(SolScanApi).inSingletonScope()
container.bind(IDS.SERVICE.GoerliScanApi).to(GoerliScanApi).inSingletonScope()
container.bind(IDS.SERVICE.DebankApi).to(DebankApi).inSingletonScope()
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
container.bind(IDS.SERVICE.CoingeckoApi).to(CoinGeckoApi).inSingletonScope()
container.bind(IDS.SERVICE.CoingeckoPriceCache).to(CoingeckoPriceCache).inSingletonScope()

container.bind(IDS.SERVICE.CryptoPageCommunity)
    .to(GoerliSocialSmartContract)
    .whenAnyAncestorNamed(ChainId.goerli)
container.bind(IDS.SERVICE.CryptoPageCommunity)
    .to(MumbaiCommunity)
    .whenAnyAncestorNamed(ChainId.mumbai).onActivation(injectChainDecorator)
container.bind(IDS.SERVICE.CryptoPageCommunity)
    .to(MumbaiCommunity)
    .whenAnyAncestorNamed(ChainId.matic).onActivation(injectChainDecorator)
container.bind(IDS.SERVICE.CryptoPageCommunity)
    .to(DefaultSocialSmartContract)
    .whenAnyAncestorMatches(request =>{
        const excludeChains:string[] = [ChainId.goerli, ChainId.mumbai, ChainId.matic],
            chainId = getChainIdFromAncestor(request) || request.target.getNamedTag()?.value

        if(!chainId){
            return false
        }

        const hasExcludedChain = excludeChains.indexOf(chainId) >= 0

        return !hasExcludedChain
    })

container.bind(IDS.SERVICE.AlchemySdkFactory).toFactory(context => (chain:ChainId) =>{
    const network = getAlchemyNetwork(chain)
    const apiKey = context.container.get<string>(buildAlchemyChainApiKeyVarname(chain))
    return new Alchemy({network, apiKey})
})
container.bind(IDS.SERVICE.AlchemySdk).toDynamicValue(context =>{
    const chain = getChainIdFromAncestor(context.currentRequest)
    if(!chain){
        throw new Error(`Failed to create Alchemy-sdk for chain ${chain}`)
    }

    const factory = container.get<Function>(IDS.SERVICE.AlchemySdkFactory)
    
    return factory(chain)
})

container.bind(IDS.MODULES.NftCache).to(NftCache)

container.bind(IDS.MODULES.TransactionManager)
    .to(EthTransactionManager)
    .whenTargetNamed(ChainId.eth)
container.bind(IDS.MODULES.TransactionManager)
    .to(UnmarshalTransactionsManager)
    .whenTargetNamed(ChainId.bsc)
container.bind(IDS.MODULES.TransactionManager)
    .to(AlchemyTransactionsManager)
    .whenTargetNamed(ChainId.matic)
container.bind(IDS.MODULES.TransactionManager)
    .to(AlchemyTransactionsManager)
    .whenTargetNamed(ChainId.mumbai)
container.bind(IDS.MODULES.TransactionManager)
    .to(SolscanTtransactionsManager)
    .whenTargetNamed(ChainId.sol)
container.bind(IDS.MODULES.TransactionManager)
    .to(TronGridApiTransactionsManager)
    .whenTargetNamed(ChainId.tron)
container.bind(IDS.MODULES.TransactionManager)
    .to(GoerliscanTtransactionsManager)
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
    .to(UnmarshalNftsManager)
    .whenTargetNamed(ChainId.bsc)
    .onActivation(nftManagerDecorator)
container.bind(IDS.MODULES.NftsManager)
    .to(AlchemyNftsManager)
    .whenTargetNamed(ChainId.matic)
    .onActivation(nftManagerDecorator)
container.bind(IDS.MODULES.NftsManager)
    .to(AlchemyNftsManager)
    .whenTargetNamed(ChainId.mumbai)
    .onActivation(nftManagerDecorator)
container.bind(IDS.MODULES.NftsManager)
    .to(UnmarshalNftsManager)
    .whenTargetNamed(ChainId.eth)
    .onActivation(nftManagerDecorator)
container.bind(IDS.MODULES.NftsManager)
    .to(GoerliNFTsManager)
    .whenTargetNamed(ChainId.goerli)
    .onActivation(nftManagerDecorator)
container.bind(IDS.MODULES.NftsManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.NftsManager)

container.bind(IDS.MODULES.TokenManager)
    .to(UnmarshalTokenManager)
    .whenTargetNamed(ChainId.eth)
container.bind(IDS.MODULES.TokenManager)
    .to(UnmarshalTokenManager)
    .whenTargetNamed(ChainId.bsc)
container.bind(IDS.MODULES.TokenManager)
    .to(UnmarshalTokenManager)
    .whenTargetNamed(ChainId.matic)
container.bind(IDS.MODULES.TokenManager)
    .to(AlchemyTokenManager)
    .whenTargetNamed(ChainId.mumbai)
container.bind(IDS.MODULES.TokenManager)
    .to(CovalentTokenManager)
    .whenTargetNamed(ChainId.sol)
container.bind(IDS.MODULES.TokenManager)
    .to(TronscanTokenManager)
    .whenTargetNamed(ChainId.tron)
container.bind(IDS.MODULES.TokenManager)
    .to(GoerliScanTokenManager)
    .whenTargetNamed(ChainId.goerli)
container.bind(IDS.MODULES.TokenManagerFactory)
    .toAutoNamedFactory(IDS.MODULES.TokenManager)

container.bind(IDS.MODULES.NftDashboard).to(NftDashboard)
container.bind(IDS.MODULES.NftDashboardFactory)
    .toAutoNamedFactory(IDS.MODULES.NftDashboard)



container.bind(IDS.ORM.REPO.ContractDetailsRepo).to(ContractDetailsRepo)
container.bind(IDS.ORM.REPO.NftTokenDetailsRepo).to(NftTokenDetailsRepo)
container.bind(IDS.ORM.REPO.ErrorLogRepo).to(ErrorLogRepo)
container.bind(IDS.ORM.REPO.BlockDetailsRepo).to(BlockDetailsRepo)
container.bind(IDS.ORM.REPO.FrontErrorsRepo).to(FrontErrorsRepo)
container.bind(IDS.ORM.REPO.PostStatisticRepo).to(PostStatisticRepo).inSingletonScope()
container.bind(IDS.ORM.REPO.UserRepo).to(UserRepo).inSingletonScope()