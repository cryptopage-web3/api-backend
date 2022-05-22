const CovalentApi = require('../services/covalent');
const config = require('../enums/chains');

describe('Solscan Service', () => {

    describe('getWalletAllTransactions', () => {
        it('should return all transactions from wallet', async () => {
            const covalentApi = new CovalentApi({ address: '0x839d4641F97153b0ff26aB837860c479E2Bd0242', config: config.eth });

            jest.spyOn(covalentApi, 'getTransactionsFromApi').mockImplementationOnce(async () => {
                return [{"block_signed_at":"2022-05-22T09:22:01Z","block_height":14822558,"tx_hash":"0x77bf12a3cfb2424f446f19b4642e5335c0e0b4b1fa977a891ee84ba027ff54bf","tx_offset":89,"successful":true,"from_address":"0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88","from_address_label":null,"to_address":"0xc4de189abf94c57f396bd4c52ab13b954febefd8","to_address_label":null,"value":"0","value_quote":0,"gas_offered":77986,"gas_spent":51967,"gas_price":24007043001,"fees_paid":"1247574003632967","gas_quote":2.4785696798170225,"gas_quote_rate":1986.7115478515625,"log_events":[{"block_signed_at":"2022-05-22T09:22:01Z","block_height":14822558,"tx_offset":89,"log_offset":87,"tx_hash":"0x77bf12a3cfb2424f446f19b4642e5335c0e0b4b1fa977a891ee84ba027ff54bf","raw_log_topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x00000000000000000000000075e89d5979e4f6fba9f97c104c2f0afb3f1dcb88","0x000000000000000000000000839d4641f97153b0ff26ab837860c479e2bd0242"],"sender_contract_decimals":18,"sender_name":"B.20","sender_contract_ticker_symbol":"B20","sender_address":"0xc4de189abf94c57f396bd4c52ab13b954febefd8","sender_address_label":null,"sender_logo_url":"https://logos.covalenthq.com/tokens/0xc4de189abf94c57f396bd4c52ab13b954febefd8.png","raw_log_data":"0x00000000000000000000000000000000000000000000003798c8183e891e0000","decoded":{"name":"Transfer","signature":"Transfer(indexed address from, indexed address to, uint256 value)","params":[{"name":"from","type":"address","indexed":true,"decoded":true,"value":"0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88"},{"name":"to","type":"address","indexed":true,"decoded":true,"value":"0x839d4641f97153b0ff26ab837860c479e2bd0242"},{"name":"value","type":"uint256","indexed":false,"decoded":true,"value":"1025580000000000000000"}]}}]}]
            });

            const transactions = await covalentApi.getWalletAllTransactions(0, 1);
            const transaction = transactions[0];
            expect(transaction).toBeDefined();
            expect(transaction.from).toEqual('0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88');
            expect(transaction.to).toEqual('0xc4de189abf94c57f396bd4c52ab13b954febefd8');
            expect(transaction.fee).toEqual(0.001247574003632967);
            expect(transaction.value).toEqual(0);
            expect(transaction.tokenSymbol).toEqual('B20');
            expect(transaction.tokenAmount).toEqual(1025.58);
            expect(transaction.title).toEqual('Transfer');
            expect(transaction.hash).toEqual('0x77bf12a3cfb2424f446f19b4642e5335c0e0b4b1fa977a891ee84ba027ff54bf');
            jest.restoreAllMocks();
        });

    });

    describe('getWalletTokenTransfers', () => {
        it('should return all token transfets from wallet', async () => {
            const covalentApi = new CovalentApi({ address: '0x839d4641F97153b0ff26aB837860c479E2Bd0242', config: config.matic });

            jest.spyOn(covalentApi, 'getTransactionsFromApi').mockImplementationOnce(async () => {
                return [{"block_signed_at":"2022-05-22T09:22:01Z","block_height":14822558,"tx_hash":"0x77bf12a3cfb2424f446f19b4642e5335c0e0b4b1fa977a891ee84ba027ff54bf","tx_offset":89,"successful":true,"from_address":"0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88","from_address_label":null,"to_address":"0xc4de189abf94c57f396bd4c52ab13b954febefd8","to_address_label":null,"value":"0","value_quote":0,"gas_offered":77986,"gas_spent":51967,"gas_price":24007043001,"fees_paid":"1247574003632967","gas_quote":2.4785696798170225,"gas_quote_rate":1986.7115478515625,"log_events":[{"block_signed_at":"2022-05-22T09:22:01Z","block_height":14822558,"tx_offset":89,"log_offset":87,"tx_hash":"0x77bf12a3cfb2424f446f19b4642e5335c0e0b4b1fa977a891ee84ba027ff54bf","raw_log_topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x00000000000000000000000075e89d5979e4f6fba9f97c104c2f0afb3f1dcb88","0x000000000000000000000000839d4641f97153b0ff26ab837860c479e2bd0242"],"sender_contract_decimals":18,"sender_name":"B.20","sender_contract_ticker_symbol":"B20","sender_address":"0xc4de189abf94c57f396bd4c52ab13b954febefd8","sender_address_label":null,"sender_logo_url":"https://logos.covalenthq.com/tokens/0xc4de189abf94c57f396bd4c52ab13b954febefd8.png","raw_log_data":"0x00000000000000000000000000000000000000000000003798c8183e891e0000","decoded":{"name":"Transfer","signature":"Transfer(indexed address from, indexed address to, uint256 value)","params":[{"name":"from","type":"address","indexed":true,"decoded":true,"value":"0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88"},{"name":"to","type":"address","indexed":true,"decoded":true,"value":"0x839d4641f97153b0ff26ab837860c479e2bd0242"},{"name":"value","type":"uint256","indexed":false,"decoded":true,"value":"1025580000000000000000"}]}}]}]
            });

            const transactions = await covalentApi.getWalletTokenTransfers(0, 1);
            const transaction = transactions[0];
            expect(transaction).toBeDefined();
            expect(transaction.from).toEqual('0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88');
            expect(transaction.to).toEqual('0xc4de189abf94c57f396bd4c52ab13b954febefd8');
            expect(transaction.fee).toEqual(0.001247574003632967);
            expect(transaction.value).toEqual(0);
            expect(transaction.tokenSymbol).toEqual('B20');
            expect(transaction.tokenAmount).toEqual(1025.58);
            expect(transaction.title).toEqual('Transfer');
            expect(transaction.hash).toEqual('0x77bf12a3cfb2424f446f19b4642e5335c0e0b4b1fa977a891ee84ba027ff54bf');
            jest.restoreAllMocks();
        });
    });
});
