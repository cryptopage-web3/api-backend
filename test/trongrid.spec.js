const TronGridApi = require('../src/services/trongrid');

describe('TronGrid Service', () => {

    describe('getWalletAllTransactions', () => {
        it('should return all transactions from wallet', async () => {
            const tronGridApi = new TronGridApi({ address: 'TBwkXiaXuMebygTV1Y3vjBYFX69fG8ETfL' });

            jest.spyOn(tronGridApi, 'getTransactionsFromApi').mockImplementationOnce(async () => {
                return [{ "ret": [{ "contractRet": "SUCCESS", "fee": 366000 }], "signature": ["8853496469a79cc285d782311772e6a18586dd235b897aa5789b6711b90b6a1c7d228f4b6f1282186fe141015e2a1bd145911c0e81a0d173c2768df0b782a68600"], "txID": "a08f9e5aefeea27ac550a2a74b6746fbcfb469e87fc518424f64540d797a6fca", "net_usage": 0, "raw_data_hex": "0a024db4220824de3bceaa13869d40e0d6b1ce8a305263e59388e5b88ce8b59ae992b1e6b8b8e6888f206b6b38686178692e636f6d20e980813130305452582020e58cbae59d97e993bee59388e5b88ce585ace5b9b3e585ace6ada3e585ace5bc80e88194e7b3bb5447e5aea2e69c8d404b4b686173683138385a65080112610a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412300a1541167c7a59bcda61f76e44c5a621642ee1589cef7112154115a9bd0744ac1448da8aa93ffa900e030e910dfb180a70ef97aece8a30", "net_fee": 366000, "energy_usage": 0, "blockNumber": 40521160, "block_timestamp": 1652116134000, "energy_fee": 0, "energy_usage_total": 0, "raw_data": { "data": "e59388e5b88ce8b59ae992b1e6b8b8e6888f206b6b38686178692e636f6d20e980813130305452582020e58cbae59d97e993bee59388e5b88ce585ace5b9b3e585ace6ada3e585ace5bc80e88194e7b3bb5447e5aea2e69c8d404b4b68617368313838", "contract": [{ "parameter": { "value": { "amount": 10, "owner_address": "41167c7a59bcda61f76e44c5a621642ee1589cef71", "to_address": "4115a9bd0744ac1448da8aa93ffa900e030e910dfb" }, "type_url": "type.googleapis.com/protocol.TransferContract" }, "type": "TransferContract" }], "ref_block_bytes": "4db4", "ref_block_hash": "24de3bceaa13869d", "expiration": 1652116188000, "timestamp": 1652116130799 }, "internal_transactions": [] }]
            });

            const { transactions } = await tronGridApi.getWalletAllTransactions(0, 1);
            const transaction = transactions[0];
            expect(transaction).toBeDefined();
            expect(transaction.fee).toEqual(0);
            expect(transaction.value).toEqual(0.00001);
            expect(transaction.tokenSymbol).toEqual('TRX');
            expect(transaction.title).toEqual('Transfer');
            expect(transaction.hash).toEqual('a08f9e5aefeea27ac550a2a74b6746fbcfb469e87fc518424f64540d797a6fca');
            jest.restoreAllMocks();
        });
    });

    describe('getWalletTokenTransfers', () => {
        it('should return all transactions from wallet', async () => {
            const tronGridApi = new TronGridApi({ address: 'TBwkXiaXuMebygTV1Y3vjBYFX69fG8ETfL' });

            jest.spyOn(tronGridApi, 'getTransactionsFromApi').mockImplementationOnce(async () => {
                return [{ "ret": [{ "contractRet": "SUCCESS", "fee": 366000 }], "signature": ["8853496469a79cc285d782311772e6a18586dd235b897aa5789b6711b90b6a1c7d228f4b6f1282186fe141015e2a1bd145911c0e81a0d173c2768df0b782a68600"], "txID": "a08f9e5aefeea27ac550a2a74b6746fbcfb469e87fc518424f64540d797a6fca", "net_usage": 0, "raw_data_hex": "0a024db4220824de3bceaa13869d40e0d6b1ce8a305263e59388e5b88ce8b59ae992b1e6b8b8e6888f206b6b38686178692e636f6d20e980813130305452582020e58cbae59d97e993bee59388e5b88ce585ace5b9b3e585ace6ada3e585ace5bc80e88194e7b3bb5447e5aea2e69c8d404b4b686173683138385a65080112610a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412300a1541167c7a59bcda61f76e44c5a621642ee1589cef7112154115a9bd0744ac1448da8aa93ffa900e030e910dfb180a70ef97aece8a30", "net_fee": 366000, "energy_usage": 0, "blockNumber": 40521160, "block_timestamp": 1652116134000, "energy_fee": 0, "energy_usage_total": 0, "raw_data": { "data": "e59388e5b88ce8b59ae992b1e6b8b8e6888f206b6b38686178692e636f6d20e980813130305452582020e58cbae59d97e993bee59388e5b88ce585ace5b9b3e585ace6ada3e585ace5bc80e88194e7b3bb5447e5aea2e69c8d404b4b68617368313838", "contract": [{ "parameter": { "value": { "amount": 10, "owner_address": "41167c7a59bcda61f76e44c5a621642ee1589cef71", "to_address": "4115a9bd0744ac1448da8aa93ffa900e030e910dfb" }, "type_url": "type.googleapis.com/protocol.TransferContract" }, "type": "TransferContract" }], "ref_block_bytes": "4db4", "ref_block_hash": "24de3bceaa13869d", "expiration": 1652116188000, "timestamp": 1652116130799 }, "internal_transactions": [] }]
            });

            const { transactions } = await tronGridApi.getWalletTokenTransfers(0, 1);
            const transaction = transactions[0];
            expect(transaction).toBeDefined();
            expect(transaction.fee).toEqual(0);
            expect(transaction.value).toEqual(0.00001);
            expect(transaction.tokenSymbol).toEqual('TRX');
            expect(transaction.title).toEqual('Transfer');
            expect(transaction.hash).toEqual('a08f9e5aefeea27ac550a2a74b6746fbcfb469e87fc518424f64540d797a6fca');
            jest.restoreAllMocks();
        });
    });
});
