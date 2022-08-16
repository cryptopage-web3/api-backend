import { InversifyExpressServer } from 'inversify-express-utils';
import { agent } from "supertest";
import { container } from '../../../src/ioc';
import { Axios } from 'axios';
import { IDS } from '../../../src/types/index';
import { unmarshalEthTokensResponse, unmarshalBscTokensResponse, unmarshalPolygonTokensResponse, covalentSolTokensResponse, tronscanTokensResponse } from './tokens-response';
import Sinon from 'sinon';
import { expect } from 'chai';

const app = new InversifyExpressServer(container).build()
const testAgent = agent(app)

const axios:Axios = container.get(IDS.NODE_MODULES.axios)
const axiosGetStub = Sinon.stub(axios,'get')

describe('test tokens api endpoints', ()=>{
    it('should return eth tokens', async ()=>{
        axiosGetStub
            .resolves({data: unmarshalEthTokensResponse})

        const response = await testAgent
            .get('/tokens/eth/0xb29c388e3fd63e1050ac5e4ca1d046dca36f004c')
            .expect('Content-Type',/json/)
        
            expect(Array.isArray(response.body.tokens)).to.eq(true)
            expect(response.body.count).to.eq(4)
            expect(response.body.tokens.length).to.eq(4)
            expect(response.body.tokens[1].symbol).to.eq('USDC')
            expect(response.body.tokens[1].address).to.eq('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
            expect(response.body.tokens[1].balance).to.eq(250870.248787)
    })

    it('should return bsc tokens', async ()=>{
        axiosGetStub
            .resolves({data: unmarshalBscTokensResponse})

        const response = await testAgent
            .get('/tokens/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)
        
            expect(Array.isArray(response.body.tokens)).to.eq(true)
            expect(response.body.count).to.eq(5)
            expect(response.body.tokens.length).to.eq(5)
            expect(response.body.tokens[1].symbol).to.eq('BNB')
            expect(response.body.tokens[1].address).to.eq('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
            expect(response.body.tokens[1].balance).to.eq(2.005001139492612)
    })

    it('should return polygon tokens', async ()=>{
        axiosGetStub
            .resolves({data: unmarshalPolygonTokensResponse})

        const response = await testAgent
            .get('/tokens/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)
        
            expect(Array.isArray(response.body.tokens)).to.eq(true)
            expect(response.body.count).to.eq(5)
            expect(response.body.tokens.length).to.eq(5)
            expect(response.body.tokens[1].symbol).to.eq('MNEP')
            expect(response.body.tokens[1].address).to.eq('0x0b91b07beb67333225a5ba0259d55aee10e3a578')
            expect(response.body.tokens[1].balance).to.eq(300000)
    })

    it('should return solana tokens', async ()=>{
        axiosGetStub
            .resolves({data: covalentSolTokensResponse})

        const response = await testAgent
            .get('/tokens/sol/Bt1rNX3q66Lq5z4Xdzk1nLkLh7wq1yVgTqnk5LHiXvdF')
            .expect('Content-Type',/json/)
        
            expect(Array.isArray(response.body.tokens)).to.eq(true)
            expect(response.body.count).to.eq(2)
            expect(response.body.tokens.length).to.eq(2)
            expect(response.body.tokens[1].symbol).to.eq('SOL')
            expect(response.body.tokens[1].name).to.eq('Solana')
            expect(response.body.tokens[1].balance).to.eq(7.29358033)
    })

    
    it('should return tron tokens', async ()=>{
        axiosGetStub
            .resolves({data: tronscanTokensResponse})

        const response = await testAgent
            .get('/tokens/tron/TYZ6QbrPaUjv62CoU7za2nVHJ1ZoEJMXah')
            .expect('Content-Type',/json/)
        
            expect(Array.isArray(response.body.tokens)).to.eq(true)
            expect(response.body.tokens.length).to.eq(3)
            expect(response.body.tokens[0].symbol).to.eq('trx')
            expect(response.body.tokens[0].name).to.eq('trx')
            expect(response.body.tokens[0].balance).to.eq(0.000192)
    })
})