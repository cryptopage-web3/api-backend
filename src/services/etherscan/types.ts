export interface IGoerliNftTransaction {
    blockHash: string
    blockNumber: string
    confirmations: string
    contractAddress: string
    cumulativeGasUsed: string
    from: string
    gas: string
    gasPrice: string
    gasUsed: string
    hash: string
    input: string
    nonce: string
    timeStamp: string
    to: string
    tokenDecimal: string
    tokenID: string
    tokenName: string
    tokenSymbol: string
    transactionIndex: string
}

export interface IGoerliTransaction {
    blockNumber: string
    timeStamp: string
    hash: string
    nonce: string
    blockHash: string
    transactionIndex: string
    from: string
    to: string
    value: string
    gas: string
    gasPrice: string
    isError: string
    txreceipt_status: string
    input: string
    contractAddress: string
    cumulativeGasUsed: string
    gasUsed: string
    confirmations: string
    methodId: string
    functionName: string
      
}