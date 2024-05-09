import { cleanUpMetadata, InversifyExpressServer } from 'inversify-express-utils';
import { agent, SuperAgentTest } from "supertest";
import { Axios } from 'axios';
import { etherscanTransactionsResponse, etherscanErc20TransactionsResponse, unmarshalBscTransactionsResponse, solscanTransactionsResponse, trongridTransactionsResponse, unmarshalEmptyResponse, goerliTransactionsResponse, mumbaiAlchemyAddrestransactionsResponse } from './transactions-response';
import { IDS } from '../../../src/types/index';
import { unmarshalPolygonTransactionResponse } from './transactions-response';
import Sinon, { SinonStub } from 'sinon';
import { expect } from 'chai';
import { Application } from 'express';
import { testContainer } from '../../ioc/test-container';
import { TestAlchemyMock } from '../../mock/test-alchemy-mock';
import { ChainId } from '../../../src/modules/transactions/types';

let app: Application
let testAgent: SuperAgentTest

let axios:Axios 
let axiosGetStub: Sinon.SinonStub

describe('test get transactions list', ()=>{
    before(async ()=>{
        await import ('../../../src/controller/transactions-controller')
        app = new InversifyExpressServer(testContainer).build()
        testAgent = agent(app)
        
        axios = testContainer.get(IDS.NODE_MODULES.axios)
        axiosGetStub  = Sinon.stub(axios,'get')
    })
    beforeEach(()=>{
        testContainer.snapshot()
    })
    afterEach(()=>{
        testContainer.restore()
    })
    after(()=>{
        cleanUpMetadata()
        Sinon.restore()
    })
    it.skip('should return eth transactions list', async ()=>{
        axiosGetStub
            .onCall(0).resolves({data: etherscanTransactionsResponse})
            .onCall(1).resolves({data: etherscanErc20TransactionsResponse})
            .onCall(2).resolves({data: {total_txs: 1074}})
            
        const response = await testAgent
            .get('/transactions/eth/0xB4047EB6707aa777746042cEB1D42D6eE3d7845e?pageSize=10')
            .expect('Content-Type',/json/)

        expect(response.body.continue.erc20).to.eq(5)
        expect(response.body.continue.tx).to.eq(11)
        expect(response.body.count).to.eq(1074)
        expect(Array.isArray(response.body.transactions)).to.eq(true)
        expect(response.body.transactions.length).to.eq(10)
        expect(response.body.transactions[0]).to.contain({
            date: "2022-08-02T00:18:27.000Z"
        })

        expect(axiosGetStub.callCount).to.eq(3)
    })

    it.skip('should return goerli transactions list', async ()=>{
        axiosGetStub
            .onCall(0).resolves({data: goerliTransactionsResponse})
            
        const response = await testAgent
            .get('/transactions/goerli/0x222b03f14db34e6c5ab5653fb7b12ac01326e648?pageSize=10')
            .expect('Content-Type',/json/)

        expect(response.body.count).to.be.undefined
        expect(response.body.transactions).to.be.an('array')
        expect(response.body.transactions.length).to.eq(1)
        expect(response.body.transactions[0]).to.contain({
            date: "2022-09-19T05:50:24.000Z"
        })

        expect(axiosGetStub.callCount).to.eq(1)
    })

    it.skip('should return polygon transactions list unmarshal', async () => {
        axiosGetStub
            .resolves({data: unmarshalPolygonTransactionResponse})

        const response = await testAgent
            .get('/transactions/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)

            expect(response.body.count).to.eq(15)
            expect(Array.isArray(response.body.transactions)).to.eq(true)
            expect(response.body.transactions.length).to.eq(10)
            expect(response.body.transactions[0].to).to.eq('0xdcc74f011a80943b2e6d26ab4f9d897c5a73d960')
            expect(response.body.transactions[0].from).to.eq('0xba7089b207205c1b2282a18c1c80e856fd424de0')
            expect(response.body.transactions[0].type).to.eq('send')

            expect(axiosGetStub.callCount).to.eq(1)
    })

    it('should return matic transactions alchemy', async () => {
        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.matic)
        
        const getAssettransfersStub = Sinon.stub(alchemy.core, 'getAssetTransfers')

        getAssettransfersStub.resolves(mumbaiAlchemyAddrestransactionsResponse)

        const walletAddress = '0x36925EedB4ffa635E34CA6469e4Fc2eDaD885376'

        const response = await testAgent
            .get(`/transactions/matic/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.transactions).to.be.an('array')
        expect(response.body.transactions.length).to.eq(10)
        expect(response.body.transactions[0]).to.contain(({
            hash: "0x4c4a3248f9c2feae486a99f37b518f705901e6f93f27fc82f8f4891f87f9e6ba",
            blockNum: 35822644,
            from: "0x358cb02bebe8a7c36755639f55567ce8fc637bd7",
            to: "0x36925eedb4ffa635e34ca6469e4fc2edad885376",
            value: 188.36907000000002,
            asset: "MATIC",
            category: "external",
            date: "2023-05-20T10:44:56.000Z"
        }))
        expect(response.body.continue).to.contain({
            pageKey: "005f49fe-a628-4cd4-8976-d2da48b2e06c"
        })

        expect(getAssettransfersStub.calledOnce).to.eq(true)
    })

    it('should return mumbai transactions', async () => {
        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.mumbai)
        
        const getAssettransfersStub = Sinon.stub(alchemy.core, 'getAssetTransfers')

        getAssettransfersStub.resolves(mumbaiAlchemyAddrestransactionsResponse)

        const walletAddress = '0x36925EedB4ffa635E34CA6469e4Fc2eDaD885376'

        const response = await testAgent
            .get(`/transactions/mumbai/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.transactions).to.be.an('array')
        expect(response.body.transactions.length).to.eq(10)
        expect(response.body.transactions[0]).to.contain(({
            hash: "0x4c4a3248f9c2feae486a99f37b518f705901e6f93f27fc82f8f4891f87f9e6ba",
            blockNum: 35822644,
            from: "0x358cb02bebe8a7c36755639f55567ce8fc637bd7",
            to: "0x36925eedb4ffa635e34ca6469e4fc2edad885376",
            value: 188.36907000000002,
            asset: "MATIC",
            category: "external",
            date: "2023-05-20T10:44:56.000Z"
        }))
        expect(response.body.continue).to.contain({    
            pageKey: "005f49fe-a628-4cd4-8976-d2da48b2e06c"
        })

        expect(getAssettransfersStub.calledOnce).to.eq(true)
    })

    it.skip('should return bsc transactions', async () =>{
        axiosGetStub
            .resolves({data: unmarshalBscTransactionsResponse})

        const response = await testAgent
            .get('/transactions/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).to.eq(755217)
            expect(Array.isArray(response.body.transactions)).to.eq(true)
            expect(response.body.transactions.length).to.eq(10)
            expect(response.body.transactions[0].to).to.eq('0x0000000000000000000000000000000000001000')
            expect(response.body.transactions[0].from).to.eq('0x2465176c461afb316ebc773c61faee85a6515daa')
            expect(response.body.transactions[0].type).to.eq('Deposit')

            expect(axiosGetStub.callCount).to.eq(1)
    })

    it.skip('should return solana transactions', async () =>{
        axiosGetStub
            .resolves({data: solscanTransactionsResponse})

        const response = await testAgent
            .get('/transactions/sol/Bt1rNX3q66Lq5z4Xdzk1nLkLh7wq1yVgTqnk5LHiXvdF')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).to.eq(5)
            expect(Array.isArray(response.body.transactions)).to.eq(true)
            expect(response.body.transactions.length).to.eq(5)
            expect(response.body.transactions[0].to).to.eq('G9tHWDcDLUbaGm2mREhbGeqe9SUPznM2quM8gu7XGrsP')
            expect(response.body.transactions[0].from).to.eq('G9tHWDcDLUbaGm2mREhbGeqe9SUPznM2quM8gu7XGrsP')

            expect(axiosGetStub.callCount).to.eq(1)
    })

    it.skip('should return tron transactions', async () =>{
        axiosGetStub
            .resolves({data: trongridTransactionsResponse})

        const response = await testAgent
            .get('/transactions/tron/TYZ6QbrPaUjv62CoU7za2nVHJ1ZoEJMXah')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).to.eq(10)
            expect(Array.isArray(response.body.transactions)).to.eq(true)
            expect(response.body.transactions.length).to.eq(10)
            expect(response.body.transactions[0].to).to.eq('TYZ6QbrPaUjv62CoU7za2nVHJ1ZoEJMXah')
            expect(response.body.transactions[0].from).to.eq('TJiAfxZthfS9NdHjieAtda2f8eAwRbJppp')

            expect(axiosGetStub.callCount).to.eq(1)
    })

    it.skip('should not return error when no eth transactions', async ()=>{
        axiosGetStub
            .onCall(0).resolves({data: {result: []}})
            .onCall(1).resolves({data: {result: []}})
            .onCall(2).resolves({data: {total_txs: 0}})
            
        const response = await testAgent
            .get('/transactions/eth/0xB4047EB6707aa777746042cEB1D42D6eE3d7845e?pageSize=10')
            .expect('Content-Type',/json/)

        expect(response.body.continue.erc20).to.eq(0)
        expect(response.body.continue.tx).to.eq(0)
        expect(response.body.count).to.eq(0)
        expect(Array.isArray(response.body.transactions)).to.eq(true)
        expect(response.body.transactions.length).to.eq(0)

        expect(axiosGetStub.callCount).to.eq(3)
    })

    it.skip('should not return error when no polygon transactions list unmarshal', async () => {
        axiosGetStub
            .resolves({data: unmarshalEmptyResponse})

        const response = await testAgent
            .get('/transactions/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).to.eq(0)
            expect(Array.isArray(response.body.transactions)).to.eq(true)
            expect(response.body.transactions.length).to.eq(0)

            expect(axiosGetStub.callCount).to.eq(1)
    })

    it('should not return error when no polygon transactions list alchemy', async () => {
        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.mumbai)
        
        const getAssettransfersStub = Sinon.stub(alchemy.core, 'getAssetTransfers')

        getAssettransfersStub.resolves({transfers:[]})

        const walletAddress = '0x36925EedB4ffa635E34CA6469e4Fc2eDaD885376'

        const response = await testAgent
            .get(`/transactions/mumbai/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.transactions).to.be.an('array')
        expect(response.body.transactions.length).to.eq(0)

        expect(getAssettransfersStub.calledOnce).to.eq(true)
    })

    it.skip('should not return error when no bsc transactions', async () =>{
        axiosGetStub
            .resolves({data: unmarshalEmptyResponse})

        const response = await testAgent
            .get('/transactions/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).to.eq(0)
            expect(Array.isArray(response.body.transactions)).to.eq(true)
            expect(response.body.transactions.length).to.eq(0)

            expect(axiosGetStub.callCount).to.eq(1)
    })

    it.skip('should not return error when no solana transactions', async () =>{
        axiosGetStub
            .resolves({data: {transactions:[]}})

        const response = await testAgent
            .get('/transactions/sol/Bt1rNX3q66Lq5z4Xdzk1nLkLh7wq1yVgTqnk5LHiXvdF')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).to.eq(0)
            expect(Array.isArray(response.body.transactions)).to.eq(true)
            expect(response.body.transactions.length).to.eq(0)

            expect(axiosGetStub.callCount).to.eq(1)
    })

    it.skip('should not return error when no tron transactions', async () =>{
        axiosGetStub
            .resolves({data: {data: []}})

        const response = await testAgent
            .get('/transactions/tron/TYZ6QbrPaUjv62CoU7za2nVHJ1ZoEJMXah')
            .expect('Content-Type',/json/)
        
            expect(response.body.count).to.eq(0)
            expect(Array.isArray(response.body.transactions)).to.eq(true)
            expect(response.body.transactions.length).to.eq(0)

            expect(axiosGetStub.callCount).to.eq(1)
    })
})