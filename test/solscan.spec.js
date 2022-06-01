const SolScanApi = require('../services/solscan');

describe('Solscan Service', () => {

    describe('getWalletAllTransactions', () => {
        it('should return all transactions from wallet', async () => {
            const solScanApi = new SolScanApi({ address: '3qmEGZpEUFYxXiLU5CZjSaUy2X28oV51qVLenKEutYDe' });

            jest.spyOn(solScanApi, 'getTransactionsFromApi').mockImplementationOnce(async () => {
                return [{ "blockTime": 1652603597, "slot": 133874336, "txHash": "4FTFFtUV1grLkfC4FKv7LVuruiuvdko51NUoeE4X678QfAFUked4KnNJjYqcVUG681DXvW6xMZZz4QfHW7VtjWy6", "fee": 5000, "status": "Success", "lamport": 0, "signer": ["3qmEGZpEUFYxXiLU5CZjSaUy2X28oV51qVLenKEutYDe"], "parsedInstruction": [{ "programId": "Vote111111111111111111111111111111111111111", "program": "vote", "type": "vote" }] }]
            });

            const { transactions } = await solScanApi.getWalletAllTransactions(0, 1);
            const transaction = transactions[0];
            expect(transaction).toBeDefined();
            expect(transaction.fee).toEqual(0.000005);
            expect(transaction.value).toEqual(0);
            expect(transaction.tokenSymbol).toEqual('SOL');
            expect(transaction.title).toEqual('Transfer');
            expect(transaction.hash).toEqual('4FTFFtUV1grLkfC4FKv7LVuruiuvdko51NUoeE4X678QfAFUked4KnNJjYqcVUG681DXvW6xMZZz4QfHW7VtjWy6');
            jest.restoreAllMocks();
        });
    });

    describe('getWalletTokenTransfers', () => {
        it('should return all transactions from wallet', async () => {
            const solScanApi = new SolScanApi({ address: '3qmEGZpEUFYxXiLU5CZjSaUy2X28oV51qVLenKEutYDe' });

            jest.spyOn(solScanApi, 'getTransactionsFromApi').mockImplementationOnce(async () => {
                return [{ "blockTime": 1652603597, "slot": 133874336, "txHash": "4FTFFtUV1grLkfC4FKv7LVuruiuvdko51NUoeE4X678QfAFUked4KnNJjYqcVUG681DXvW6xMZZz4QfHW7VtjWy6", "fee": 5000, "status": "Success", "lamport": 0, "signer": ["3qmEGZpEUFYxXiLU5CZjSaUy2X28oV51qVLenKEutYDe"], "parsedInstruction": [{ "programId": "Vote111111111111111111111111111111111111111", "program": "vote", "type": "vote" }] }]
            });

            const { transactions } = await solScanApi.getWalletTokenTransfers(0, 1);
            const transaction = transactions[0];
            expect(transaction).toBeDefined();
            expect(transaction.fee).toEqual(0.000005);
            expect(transaction.value).toEqual(0);
            expect(transaction.tokenSymbol).toEqual('SOL');
            expect(transaction.title).toEqual('Transfer');
            expect(transaction.hash).toEqual('4FTFFtUV1grLkfC4FKv7LVuruiuvdko51NUoeE4X678QfAFUked4KnNJjYqcVUG681DXvW6xMZZz4QfHW7VtjWy6');
            jest.restoreAllMocks();
        });
    });
});
