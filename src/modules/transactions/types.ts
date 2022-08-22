export enum ChainId {
    eth='eth',
    bsc='bsc',
    matic='matic',
    sol='sol',
    tron='tron',
    goerli='goerli'
}

export interface ITransactionManager {
    getWalletAllTransactions(address:string, opts: ITransactionsPagination): Promise<Paginator>
    getTransactionDetails(txHash:string)
    getWalletTokenTransfers(address:string, opts: ITransactionsPagination)
}

export interface ITransactionsPagination {
    tx?: number,
    erc20?: number,
    page?:number,
    pageSize: number,
    fingerprint?: string,
    beforeHash?: string
}

export interface ITransactionsNexPagePagination {
    tx?: number,
    erc20?: number,
    fingerprint?: string,
    beforeHash?: string
}

export interface Paginator {
    transactions: any[],
    count?: number,
    continue?: ITransactionsNexPagePagination
}

export namespace Etherscan {
    export enum OperationType {
        send='send',
        receive='receive',
        swap='swap',
        contract_call='contract_execution'
    }

    export enum TransactionType {
        normal='normal',
        erc20='erc20'
    }

    export interface ITransactionData {
        transactionType: TransactionType.normal
        operationType: OperationType
        blockNumber: number
        timeStamp: number
        hash: string
        nonce: number
        blockHash: number
        transactionIndex: number
        from: string
        to: string
        value: number
        gas: number
        gasPrice: number
        isError: string
        txreceipt_status: string
        input: string
        contractAddress: string
        cumulativeGasUsed: number
        gasUsed: string
        confirmations: number
        methodId: string
        functionName:string
        send?: IErc20TransactionData[]
        receive?: IErc20TransactionData[]
    }

    export interface IErc20TransactionData {
        transactionType: TransactionType.erc20
        operationType: OperationType
        blockNumber: number
        timeStamp: number
        hash: string
        nonce: number
        blockHash: string
        from: string
        contractAddress: string
        to: string
        value: number
        tokenName: string
        tokenSymbol: string
        tokenDecimal: number
        transactionIndex: number
        gas: number
        gasPrice: number
        gasUsed: number
        cumulativeGasUsed: number
        input: string
        confirmations: number
        send?: IErc20TransactionData[]
        receive?: IErc20TransactionData[]
    }

    export type EthTransaction = ITransactionData | IErc20TransactionData
}