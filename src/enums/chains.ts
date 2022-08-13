import { ChainId } from '../modules/transactions/types';

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
        rpc: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        nativeCoinId: 'ethereum'
    }
}

export function getChainConf(chain: ChainId){
    if(!chainConfig[chain]){
        throw new Error(`Invalid chain config ${chain}`)
    }

    return chainConfig[chain]
}