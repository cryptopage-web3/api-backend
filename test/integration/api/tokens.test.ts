import { cleanUpMetadata, InversifyExpressServer } from 'inversify-express-utils';
import { agent, SuperAgentTest } from "supertest";
import { Axios } from 'axios';
import { IDS } from '../../../src/types/index';
import { unmarshalEthTokensResponse, unmarshalBscTokensResponse, unmarshalPolygonTokensResponse, covalentSolTokensResponse, tronscanTokensResponse, mumbaiAlchemyTokensResponse, mumbaiTokensCoingeckoMarkets, mumbaiTokenMetaResponses, coingeckoLinkId } from './tokens-response';
import Sinon from 'sinon';
import { expect } from 'chai';
import { Application } from 'express';
import { testContainer } from '../../ioc/test-container';
import { TestAlchemyMock } from '../../mock/test-alchemy-mock';
import { ChainId } from '../../../src/modules/transactions/types';

let app: Application
let testAgent: SuperAgentTest

let axios:Axios 
let axiosGetStub: Sinon.SinonStub

describe('test tokens api endpoints', ()=>{
    before(async ()=>{
        await import ('../../../src/controller/token-controller')
        app = new InversifyExpressServer(testContainer).build()
        testAgent = agent(app)
        axios = testContainer.get(IDS.NODE_MODULES.axios)
        axiosGetStub  = Sinon.stub(axios,'get')
    })
    after(()=>{
        cleanUpMetadata()
        Sinon.restore()
    })
    it.skip('should return eth tokens', async ()=>{
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

    it.skip('should return bsc tokens', async ()=>{
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

    it('should return mumbai tokens', async () => {
        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.mumbai)
        
        const getTokenbalancesStub = Sinon.stub(alchemy.core, 'getTokenBalances')
        const getTokenMetaStub = Sinon.stub(alchemy.core, 'getTokenMetadata')

        getTokenbalancesStub.resolves(mumbaiAlchemyTokensResponse)
        getTokenMetaStub
            .onCall(0).resolves(mumbaiTokenMetaResponses[0])
            .onCall(1).resolves(mumbaiTokenMetaResponses[1])

        axiosGetStub
            .onCall(0).resolves({data: [coingeckoLinkId]})
            .onCall(1).resolves({data: mumbaiTokensCoingeckoMarkets})

        const walletAddress = '0x7E3353a9f992431059D7F340EF4c77016F9be8aB'

        const response = await testAgent
            .get(`/tokens/mumbai/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.tokens).to.be.an('array')
        expect(response.body.tokens.length).to.eq(3)
        expect(response.body.tokens[1]).to.contain(({
            name: 'ChainLink Token',
            symbol: 'LINK',
            address: '0x326c977e6efc84e512bb9c30f76e30c160ed06fb',
            logo: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1547034700",
            balance: 1,
            percentChange: -4.77824,
            price: 6.1,
            balancePrice: 6.1
        }))

        expect(getTokenbalancesStub.calledOnce).to.eq(true)
        expect(getTokenMetaStub.calledTwice).to.eq(true)
        expect(axiosGetStub.calledTwice).to.eq(true)
    })

    it.skip('should return solana tokens', async ()=>{
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

    
    it.skip('should return tron tokens', async ()=>{
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