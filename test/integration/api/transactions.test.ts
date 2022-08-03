require('dotenv').config()

import "reflect-metadata"

import { InversifyExpressServer } from 'inversify-express-utils';
import { agent } from "supertest";
import { container } from '../../../src/ioc';
import { Axios } from 'axios';
import { etherscanTransactionsResponse, etherscanErc20TransactionsResponse } from './eth-transactions-response';
import { IDS } from '../../../src/types/index';

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
})