module.exports = {
    eth: {
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
    bsc: {
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
    matic: {
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
    sol: {
        evm: false,
        chainId: 1399811149,
        explorerUrl: 'https://solscan.io/tx/',
        nativeCoinSymbol: 'SOL',
        nativeCoinId: 'solana'
    },
    tron: {
        evm: false,
        explorerUrl: 'https://tronscan.org/#/transaction/',
        nativeCoinSymbol: 'TRX',
        nativeCoinId: 'tron'
    }
};