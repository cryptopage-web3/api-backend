import { InversifyExpressServer, cleanUpMetadata } from 'inversify-express-utils'
import { SuperAgentTest, agent } from 'supertest'
import { testContainer } from '../../ioc/test-container'
import { Axios } from 'axios'
import Sinon from 'sinon'
import { IDS } from '../../../src/types'
import { debankUserTokensResponse } from './user-response';
import { expect } from 'chai'

describe('test user api endpoints', ()=>{
    let testAgent: SuperAgentTest
    let axios:Axios
    let axiosGetStub: Sinon.SinonStub

    before(async ()=>{
        await import ('../../../src/controller/user-controller')

        const app = new InversifyExpressServer(testContainer).build()
        
        testAgent = agent(app)
    })
    after(()=>{
        cleanUpMetadata()
        Sinon.restore()
    })
    beforeEach(()=>{
        testContainer.snapshot()
        axios = testContainer.get(IDS.NODE_MODULES.axios)
        axiosGetStub  = Sinon.stub(axios,'get')
    })
    afterEach(()=>{
        testContainer.restore()
    })

    it('wallet tokens on all chains',async()=>{
        axiosGetStub.resolves({data: debankUserTokensResponse})

        const response = await testAgent
            .get('/user/tokens/0xb29c388e3fd63e1050ac5e4ca1d046dca36f004c')
            .expect('Content-Type',/json/)

        expect(Array.isArray(response.body.tokens)).to.eq(true)
        expect(response.body.tokens.length).to.eq(debankUserTokensResponse.length)
        expect(response.body.tokens[0].name).to.eq('ETH')
        expect(response.body.tokens[0].chain).to.eq('eth')
        expect(response.body.tokens[0].symbol).to.eq(debankUserTokensResponse[0].optimized_symbol)
        expect(response.body.tokens[0].amount).to.eq(debankUserTokensResponse[0].amount)
        expect(response.body.tokens[0].logo_url).to.eq(debankUserTokensResponse[0].logo_url)
        expect(response.body.tokens[0].price).to.eq(debankUserTokensResponse[0].price)
    })
})