require('dotenv').config()

import "reflect-metadata"

import { InversifyExpressServer } from 'inversify-express-utils';
import { agent } from "supertest";
import { container } from '../../../src/ioc';
import { Axios } from 'axios';
import { IDS } from '../../../src/types/index';
import { unmarshalEthTokensResponse, unmarshalBscTokensResponse, unmarshalPolygonTokensResponse, covalentSolTokensResponse, tronscanTokensResponse } from './tokens-response';

const app = new InversifyExpressServer(container).build()
const testAgent = agent(app)

jest.mock('axios')

const axios:Axios = container.get(IDS.NODE_MODULES.axios)

describe('test tokens api endpoints', ()=>{
    afterEach(()=>{
        jest.resetAllMocks()
    })

    it('should return eth tokens', async ()=>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: unmarshalEthTokensResponse})

        const response = await testAgent
            .get('/tokens/eth/0xb29c388e3fd63e1050ac5e4ca1d046dca36f004c')
            .expect('Content-Type',/json/)
        
            expect(Array.isArray(response.body.tokens)).toBe(true)
            expect(response.body.count).toBe(4)
            expect(response.body.tokens.length).toBe(4)
            expect(response.body.tokens[1].symbol).toBe('USDC')
            expect(response.body.tokens[1].address).toBe('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
            expect(response.body.tokens[1].balance).toBe(250870.248787)
    })

    it.only('should return bsc tokens', async ()=>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: unmarshalBscTokensResponse})

        const response = await testAgent
            .get('/tokens/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)
        
            expect(Array.isArray(response.body.tokens)).toBe(true)
            expect(response.body.count).toBe(5)
            expect(response.body.tokens.length).toBe(5)
            expect(response.body.tokens[1].symbol).toBe('BNB')
            expect(response.body.tokens[1].address).toBe('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
            expect(response.body.tokens[1].balance).toBe(2.005001139492612)
    })

    it('should return polygon tokens', async ()=>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: unmarshalPolygonTokensResponse})

        const response = await testAgent
            .get('/tokens/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)
        
            expect(Array.isArray(response.body.tokens)).toBe(true)
            expect(response.body.count).toBe(5)
            expect(response.body.tokens.length).toBe(5)
            expect(response.body.tokens[1].symbol).toBe('MNEP')
            expect(response.body.tokens[1].address).toBe('0x0b91b07beb67333225a5ba0259d55aee10e3a578')
            expect(response.body.tokens[1].balance).toBe(300000)
    })

    it('should return solana tokens', async ()=>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: covalentSolTokensResponse})

        const response = await testAgent
            .get('/tokens/sol/Bt1rNX3q66Lq5z4Xdzk1nLkLh7wq1yVgTqnk5LHiXvdF')
            .expect('Content-Type',/json/)
        
            expect(Array.isArray(response.body.tokens)).toBe(true)
            expect(response.body.count).toBe(2)
            expect(response.body.tokens.length).toBe(2)
            expect(response.body.tokens[1].symbol).toBe('SOL')
            expect(response.body.tokens[1].name).toBe('Solana')
            expect(response.body.tokens[1].balance).toBe(7.29358033)
    })

    
    it('should return tron tokens', async ()=>{
        (axios.get as jest.Mock)
            .mockResolvedValueOnce({data: tronscanTokensResponse})

        const response = await testAgent
            .get('/tokens/tron/TYZ6QbrPaUjv62CoU7za2nVHJ1ZoEJMXah')
            .expect('Content-Type',/json/)
        
            expect(Array.isArray(response.body.tokens)).toBe(true)
            expect(response.body.tokens.length).toBe(3)
            expect(response.body.tokens[0].symbol).toBe('trx')
            expect(response.body.tokens[0].name).toBe('trx')
            expect(response.body.tokens[0].balance).toBe(0.000192)
    })
})