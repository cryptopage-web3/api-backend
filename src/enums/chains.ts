import { ChainId } from '../modules/transactions/types';
import { envToString } from '../util/env-util';

export const chainConfig = {
    [ChainId.eth]: {
        evm: true,
        chainId: 1,
        chain: 'eth',
        chainName: 'ethereum',
        explorerUrl: 'https://etherscan.io/tx/',
        nativeCoinSymbol: 'ETH',
        apiUrl: 'https://api.etherscan.io/api?',
        apiKey: 'VQDBC4GZA5MQT2F6IRW2U6RPH66HJRSF6S',
        rpc: 'https://eth.public-rpc.com',
        nativeCoinId: 'ethereum'
    },
    [ChainId.bsc]: {
        evm: true,
        chainId: 56,
        chain: 'bsc',
        chainName: 'bsc',
        explorerUrl: 'https://bscscan.com/tx/',
        nativeCoinSymbol: 'BNB',
        apiUrl: 'https://api.bscscan.com/api?',
        apiKey: 'TQDPK4XAU4BZT8WQNN6IETRRXXDI37W64Y',
        rpc: 'https://bscrpc.com',
        nativeCoinId: 'binancecoin'
    },
    [ChainId.matic]: {
        evm: true,
        chainId: 137,
        chain: 'matic',
        chainName: 'matic',
        explorerUrl: 'https://polygonscan.com/tx/',
        nativeCoinSymbol: 'MATIC',
        apiUrl: 'https://api.polygonscan.com/api?',
        apiKey: '4DCKF5U2YGR1HNG1KHWP8DSK47AH85W28Z',
        rpc: 'https://polygon-rpc.com',
        nativeCoinId: 'matic-network'
    },
    [ChainId.sol]: {
        evm: false,
        chainId: 1399811149,
        explorerUrl: 'https://solscan.io/tx/',
        nativeCoinSymbol: 'SOL',
        nativeCoinId: 'solana'
    },
    [ChainId.tron]: {
        evm: false,
        explorerUrl: 'https://tronscan.org/#/transaction/',
        nativeCoinSymbol: 'TRX',
        nativeCoinId: 'tron'
    },
    [ChainId.goerli]: {
        evm: true,
        chainId: 5,
        chain: 'goerli',
        chainName: 'goerli',
        explorerUrl: 'https://goerli.etherscan.io/tx/',
        nativeCoinSymbol: 'Goerli ETH',
        apiUrl: 'https://api.goerli.etherscan.io/api?',
        apiKey: 'VQDBC4GZA5MQT2F6IRW2U6RPH66HJRSF6S',
        rpc: envToString('WEB3_RPC_URL_GOERLI'),
        nativeCoinId: 'ethereum'
    }
}

export function getChainConf(chain: ChainId){
    if(!chainConfig[chain]){
        throw new Error(`Invalid chain config ${chain}`)
    }

    return chainConfig[chain]
}

export function getChainRpc(chain: ChainId){
    const rpc = (getChainConf(chain) as any)?.rpc

    if(!rpc){
        throw new Error(`rpc is not configured for chain: ${chain}`)
    }

    return rpc
}