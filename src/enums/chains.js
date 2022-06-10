module.exports = {
    eth: {
        evm: true,
        chainId: 1,
        explorerUrl: 'https://etherscan.io/tx/',
        nativeCoinSymbol: 'ETH',
        nativeCoinId: 'ethereum'
    },
    bsc: {
        evm: true,
        chainId: 56,
        explorerUrl: 'https://bscscan.com/tx/',
        nativeCoinSymbol: 'BNB',
        nativeCoinId: 'binancecoin'
    },
    matic: {
        evm: true,
        chainId: 137,
        explorerUrl: 'https://polygonscan.com/tx/',
        nativeCoinSymbol: 'MATIC',
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
}