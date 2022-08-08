require('dotenv').config()

import "reflect-metadata"

import { InversifyExpressServer } from 'inversify-express-utils';
import { agent } from "supertest";
import { container } from '../../../src/ioc';
import { Axios } from 'axios';
import { etherscanTransactionsResponse, etherscanErc20TransactionsResponse, unmarshalBscTransactionsResponse, solscanTransactionsResponse, trongridTransactionsResponse, unmarshalEmptyResponse } from './transactions-response';
import { IDS } from '../../../src/types/index';
import { unmarshalPolygonTransactionResponse } from './transactions-response';

const app = new InversifyExpressServer(container).build()
const testAgent = agent(app)

jest.mock('axios')

const axios:Axios = container.get(IDS.NODE_MODULES.axios)

describe('test get transactions list', ()=>{
    beforeEach(()=>{
        jest.resetAllMocks()
    })
    
    it('should return eth transactions list', async ()=>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: etherscanTransactionsResponse})
            .mockResolvedValueOnce({data: etherscanErc20TransactionsResponse})
            .mockResolvedValueOnce({data: {total_txs: 1074}})
            
        const response = await testAgent
            .get('/transactions/eth/0xB4047EB6707aa777746042cEB1D42D6eE3d7845e?pageSize=10')
            .expect('Content-Type',/json/)

        expect(response.body.continue.erc20).toBe(5)
        expect(response.body.continue.tx).toBe(11)
        expect(response.body.count).toBe(1074)
        expect(Array.isArray(response.body.transactions)).toBe(true)
        expect(response.body.transactions.length).toBe(10)
    })

    it('should return polygon transactions list', async () => {
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: unmarshalPolygonTransactionResponse})

        const response = await testAgent
            .get('/transactions/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).toBe(15)
            expect(Array.isArray(response.body.transactions)).toBe(true)
            expect(response.body.transactions.length).toBe(10)
            expect(response.body.transactions[0].to).toBe('0xdcc74f011a80943b2e6d26ab4f9d897c5a73d960')
            expect(response.body.transactions[0].from).toBe('0xba7089b207205c1b2282a18c1c80e856fd424de0')
            expect(response.body.transactions[0].type).toBe('send')
    })

    it('should return bsc transactions', async () =>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: unmarshalBscTransactionsResponse})

        const response = await testAgent
            .get('/transactions/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).toBe(755217)
            expect(Array.isArray(response.body.transactions)).toBe(true)
            expect(response.body.transactions.length).toBe(10)
            expect(response.body.transactions[0].to).toBe('0x0000000000000000000000000000000000001000')
            expect(response.body.transactions[0].from).toBe('0x2465176c461afb316ebc773c61faee85a6515daa')
            expect(response.body.transactions[0].type).toBe('Deposit')
    })

    it('should return solana transactions', async () =>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: solscanTransactionsResponse})

        const response = await testAgent
            .get('/transactions/sol/Bt1rNX3q66Lq5z4Xdzk1nLkLh7wq1yVgTqnk5LHiXvdF')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).toBe(5)
            expect(Array.isArray(response.body.transactions)).toBe(true)
            expect(response.body.transactions.length).toBe(5)
            expect(response.body.transactions[0].to).toBe('G9tHWDcDLUbaGm2mREhbGeqe9SUPznM2quM8gu7XGrsP')
            expect(response.body.transactions[0].from).toBe('G9tHWDcDLUbaGm2mREhbGeqe9SUPznM2quM8gu7XGrsP')
    })

    it('should return tron transactions', async () =>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: trongridTransactionsResponse})

        const response = await testAgent
            .get('/transactions/tron/TYZ6QbrPaUjv62CoU7za2nVHJ1ZoEJMXah')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).toBe(10)
            expect(Array.isArray(response.body.transactions)).toBe(true)
            expect(response.body.transactions.length).toBe(10)
            expect(response.body.transactions[0].to).toBe('TYZ6QbrPaUjv62CoU7za2nVHJ1ZoEJMXah')
            expect(response.body.transactions[0].from).toBe('TJiAfxZthfS9NdHjieAtda2f8eAwRbJppp')
    })

    it('should not return error when no eth transactions', async ()=>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: {result: []}})
            .mockResolvedValueOnce({data: {result: []}})
            .mockResolvedValueOnce({data: {total_txs: 0}})
            
        const response = await testAgent
            .get('/transactions/eth/0xB4047EB6707aa777746042cEB1D42D6eE3d7845e?pageSize=10')
            .expect('Content-Type',/json/)

        expect(response.body.continue.erc20).toBe(0)
        expect(response.body.continue.tx).toBe(0)
        expect(response.body.count).toBe(0)
        expect(Array.isArray(response.body.transactions)).toBe(true)
        expect(response.body.transactions.length).toBe(0)
    })

    it('should not return error when no polygon transactions list', async () => {
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: unmarshalEmptyResponse})

        const response = await testAgent
            .get('/transactions/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).toBe(0)
            expect(Array.isArray(response.body.transactions)).toBe(true)
            expect(response.body.transactions.length).toBe(0)
    })

    it('should not return error when no bsc transactions', async () =>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: unmarshalEmptyResponse})

        const response = await testAgent
            .get('/transactions/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).toBe(0)
            expect(Array.isArray(response.body.transactions)).toBe(true)
            expect(response.body.transactions.length).toBe(0)
    })

    it('should not return error when no solana transactions', async () =>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: {transactions:[]}})

        const response = await testAgent
            .get('/transactions/sol/Bt1rNX3q66Lq5z4Xdzk1nLkLh7wq1yVgTqnk5LHiXvdF')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).toBe(0)
            expect(Array.isArray(response.body.transactions)).toBe(true)
            expect(response.body.transactions.length).toBe(0)
    })

    it('should not return error when no tron transactions', async () =>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: {data: []}})

        const response = await testAgent
            .get('/transactions/tron/TYZ6QbrPaUjv62CoU7za2nVHJ1ZoEJMXah')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).toBe(0)
            expect(Array.isArray(response.body.transactions)).toBe(true)
            expect(response.body.transactions.length).toBe(0)
    })
})