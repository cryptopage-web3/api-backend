import { InversifyExpressServer } from 'inversify-express-utils';
import { agent } from "supertest";
import { container } from '../../../src/ioc';
import { Axios } from 'axios';
import { IDS } from '../../../src/types/index';
import { unmarshalEthNftsResponse, unmarshalNftTransactionsEmptyResponse, unmarshalEthNftTransactionsResponse, unmarshalMaticNftsResponse, unmarshalBscNtsResponse, unmarshalNtsEmptyResponse, unmarshalMaticNftTransactionsResponse, unmarshalBscNfttransactionsResponse, unmarshalEthNftDetailsResponse, unmarshalMaticNftDetailsResponse, unmarshalBscNftDetailsResponse, goerlyErrorResponse } from './nfts-response';
import Sinon, { SinonStub } from 'sinon';
import { expect } from 'chai';
import { NftTokenDetails } from '../../../src/orm/model/nft-token-details';
import Web3 from 'web3';

const app = new InversifyExpressServer(container).build()
const testAgent = agent(app)

const axios:Axios = container.get(IDS.NODE_MODULES.axios)

const axiosGetStub = Sinon.stub(axios, 'get')
const tokenDetailsStub = Sinon.stub(NftTokenDetails, 'findOne')
const axiosHeadStub = Sinon.stub(axios, 'head')
const saveTokenStub = Sinon.stub(NftTokenDetails, 'create')

describe('test nfts api endpoints', ()=>{
    beforeEach(()=>{
        container.snapshot()
    })
    afterEach(()=>{
        container.restore()
    })
    it('should return eth nfts', async ()=>{
        axiosGetStub
            .resolves({data: unmarshalEthNftsResponse})

        const response = await testAgent
            .get('/nfts/eth/0xb29c388e3fd63e1050ac5e4ca1d046dca36f004c')
            .expect('Content-Type',/json/)

            expect(Array.isArray(response.body.list)).to.eq(true)
            expect(response.body.count).to.eq(13)
            expect(response.body.list.length).to.eq(10)
            expect(response.body.list[0]).to.contain(({
                from: '0x8b27de7f6a7542ee70e2420e1bc67fc479d01984',
                to: '0xb29c388e3fd63e1050ac5e4ca1d046dca36f004c',
                //name: 'v1 punk #8561',
                tokenId: '8561'
            }))

            expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should return polygon nfts', async () => {
        axiosGetStub
            .resolves({data: unmarshalMaticNftsResponse})

        const response = await testAgent
            .get('/nfts/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)

            expect(response.body.count).to.eq(102)
            expect(response.body.list).to.be.an('array')
            expect(response.body.list.length).to.eq(4)
            expect(response.body.list[0]).to.contain(({
                contract_address: '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
                from: '0xb7f8d0b571f9fc79e896c778ccdff2f92279ac21',
                to: '0xBA7089b207205c1B2282A18c1C80E856Fd424de0',
                tokenId: '1267276096787188443380565843485598748588859320258549594955629332512307718469'
            }))

            expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should return bsc nfts', async () => {
        axiosGetStub
            .resolves({data: unmarshalBscNtsResponse})

        const response = await testAgent
            .get('/nfts/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)

            expect(response.body.count).to.eq(2)
            expect(Array.isArray(response.body.list)).to.eq(true)
            expect(response.body.list.length).to.eq(2)
            expect(response.body.list[0]).to.contain(({
                contract_address: '0x3d7b0001e03096d3795fd5d984ad679467546d73',
                from: '0x3c284a074afe106adbc1b6eeea1c15983eafdc47',
                to: '0x2465176C461AfB316ebc773C61fAEe85A6515DAA',
                tokenId: '166401'
            }))

            expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should not return error eth nfts', async ()=>{
        axiosGetStub
            .resolves({data: unmarshalNtsEmptyResponse})

        const response = await testAgent
            .get('/nfts/eth/0xb29c388e3fd63e1050ac5e4ca1d046dca36f004c')
            .expect('Content-Type',/json/)

            expect(Array.isArray(response.body.list)).to.eq(true)
            expect(response.body.count).to.eq(0)
            expect(response.body.list.length).to.eq(0)

            expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should not return error polygon nfts', async () => {
        axiosGetStub
            .resolves({data: unmarshalNtsEmptyResponse})

        const response = await testAgent
            .get('/nfts/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)

            expect(Array.isArray(response.body.list)).to.eq(true)
            expect(response.body.count).to.eq(0)
            expect(response.body.list.length).to.eq(0)

            expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should not return error bsc nfts', async () => {
        axiosGetStub
            .resolves({data: unmarshalNtsEmptyResponse})

        const response = await testAgent
            .get('/nfts/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)

            expect(Array.isArray(response.body.list)).to.eq(true)
            expect(response.body.count).to.eq(0)
            expect(response.body.list.length).to.eq(0)

            expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should not fall when api key limit reached, goerli nfts', async () => {
        axiosGetStub
            .resolves({data: goerlyErrorResponse})

        const response = await testAgent
            .get('/nfts/goerli/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)

            expect(response.body.message).to.be.eq('Unexpected error')

            expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should return eth nft transactions', async ()=>{
        axiosGetStub.resolves({data: unmarshalEthNftTransactionsResponse})

        const response = await testAgent
            .get('/nfts/transactions/eth/0x2aDe7E7ed11a4E35C2dDCCB6189d4fE710A165f5')
            .expect('Content-Type',/json/)

        expect(Array.isArray(response.body.list)).to.eq(true)
        expect(response.body.count).to.eq(24)
        expect(response.body.list.length).to.eq(10)
        expect(response.body.list[0]).to.contain(({
            from: '0xb000953624c10427ad028510cf3249388ffdf310',
            to: '0xb29c388e3fd63e1050ac5e4ca1d046dca36f004c',
            blockNumber: 15300497,
            tokenId: '86322540947695616051707333350443506684962566151002367173878109827558281315304'
        }))

        expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should return matic nft transactions', async ()=>{
        axiosGetStub.resolves({data: unmarshalMaticNftTransactionsResponse})

        const response = await testAgent
            .get('/nfts/transactions/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)

        expect(Array.isArray(response.body.list)).to.eq(true)
        expect(response.body.count).to.eq(116)
        expect(response.body.list.length).to.eq(4)
        expect(response.body.list[0]).to.contain(({
            type: 'base_info',
            from: '0xae94ccf82b3c8044b31a4fcff2455480763ae226',
            to: '0xba7089b207205c1b2282a18c1c80e856fd424de0',
            blockNumber: 31467970,
            tokenId: '78965343665950388415519985342127408390054350375949077399659463369044632110752'
        }))

        expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should return bsc nft transactions', async ()=>{
        axiosGetStub.resolves({data: unmarshalBscNfttransactionsResponse})

        const response = await testAgent
            .get('/nfts/transactions/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)

        expect(Array.isArray(response.body.list)).to.eq(true)
        expect(response.body.count).to.eq(2)
        expect(response.body.list.length).to.eq(2)
        expect(response.body.list[0]).to.contain(({
            type: 'base_info',
            from: '0x7bf3fde4fe3d031caf369bfd15855b31b4512a9d',
            to: '0x2465176c461afb316ebc773c61faee85a6515daa',
            blockNumber: 16196556,
            tokenId: '340282366920938463463374607431768211749'
        }))

        expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should not return error eth nfts transactions', async ()=>{
        axiosGetStub
            .resolves({data: unmarshalNftTransactionsEmptyResponse})

        const response = await testAgent
            .get('/nfts/transactions/eth/0x2aDe7E7ed11a4E35C2dDCCB6189d4fE710A165f5')
            .expect('Content-Type',/json/)

            expect(Array.isArray(response.body.list)).to.eq(true)
            expect(response.body.count).to.eq(0)
            expect(response.body.list.length).to.eq(0)

            expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should not return error matic nft transactions', async ()=>{
        axiosGetStub.resolves({data: unmarshalNftTransactionsEmptyResponse})

        const response = await testAgent
            .get('/nfts/transactions/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)

        expect(Array.isArray(response.body.list)).to.eq(true)
        expect(response.body.count).to.eq(0)
        expect(response.body.list.length).to.eq(0)

        expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should not return error bsc nft transactions', async ()=>{
        axiosGetStub.resolves({data: unmarshalNftTransactionsEmptyResponse})

        const response = await testAgent
            .get('/nfts/transactions/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)

        expect(Array.isArray(response.body.list)).to.eq(true)
        expect(response.body.count).to.eq(0)
        expect(response.body.list.length).to.eq(0)

        expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should return eth nfts token details', async ()=>{
        let web3GetBlockStub:SinonStub

        container.onActivation(IDS.NODE_MODULES.web3,(context,instasnce:Web3) => {
            web3GetBlockStub = Sinon.stub(instasnce.eth, 'getBlock')

            web3GetBlockStub.resolves({timestamp: 1659947419})

            return instasnce
        })
        
        axiosGetStub.resolves({data: unmarshalEthNftDetailsResponse})
        axiosHeadStub.resolves({headers:{'content-type': 'image/png'}})
        saveTokenStub.resolves()
        tokenDetailsStub.resolves(null)
        

        const contractAddress = '0x495f947276749ce646f68ac8c248420045cb7b5e',
            tokenId = '86322540947695616051707333350443506684962566151002367173878109827558281315304',
            blockNumber = 15300497

        const response = await testAgent
            .get(`/nfts/transaction/eth/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)

        expect(response.body).contain({
            tokenId,
            type: 'image',
            url: unmarshalEthNftDetailsResponse.nft_token_details[0].image_url,
            date: '2022-08-08T08:30:19.000Z'
        })
        expect(axiosGetStub.callCount).to.eq(1)
        expect(axiosHeadStub.callCount).to.eq(1)
        expect(tokenDetailsStub.callCount).to.eq(1)
        expect(saveTokenStub.callCount).to.eq(1)
        //@ts-expect-error
        expect(web3GetBlockStub.callCount).to.eq(1)
    })

    it('should return matic nft token details', async ()=>{
        let web3GetBlockStub:SinonStub

        container.onActivation(IDS.NODE_MODULES.web3,(context,instasnce:Web3) => {
            web3GetBlockStub = Sinon.stub(instasnce.eth, 'getBlock')

            web3GetBlockStub.resolves({timestamp: 1659520065})

            return instasnce
        })

        axiosGetStub.resolves({data: unmarshalMaticNftDetailsResponse})
        axiosHeadStub.resolves({headers:{'content-type': 'image/gif'}})
        saveTokenStub.resolves()
        tokenDetailsStub.resolves(null)

        const contractAddress = '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
            tokenId = '78965343665950388415519985342127408390054350375949077399659463369044632110752',
            blockNumber = 31467970

        const response = await testAgent
            .get(`/nfts/transaction/matic/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)

        expect(response.body).contain({
            tokenId,
            type: 'image',
            url: unmarshalMaticNftDetailsResponse.nft_token_details[0].image_url,
            date: '2022-08-03T09:47:45.000Z'
        })
        expect(axiosGetStub.callCount).to.eq(1)
        expect(axiosHeadStub.callCount).to.eq(1)
        expect(tokenDetailsStub.callCount).to.eq(1)
        expect(saveTokenStub.callCount).to.eq(1)

        //@ts-expect-error
        expect(web3GetBlockStub.callCount).to.eq(1)
    })

    it('should return bsc nft token details', async ()=>{
        let web3GetBlockStub:SinonStub

        container.onActivation(IDS.NODE_MODULES.web3,(context,instasnce:Web3) => {
            web3GetBlockStub = Sinon.stub(instasnce.eth, 'getBlock')

            web3GetBlockStub.resolves({timestamp: 1647696865})

            return instasnce
        })

        axiosGetStub.resolves({data: unmarshalBscNftDetailsResponse})
        saveTokenStub.resolves()
        tokenDetailsStub.resolves(null)

        const contractAddress = '0x7dcdefb5f0844619ac16bcd5f36c3014efa90931',
            tokenId = '340282366920938463463374607431768211749',
            blockNumber = 16196556

        const response = await testAgent
            .get(`/nfts/transaction/bsc/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)

        expect(response.body).contain({
            tokenId,
            type: 'image',
            url: unmarshalBscNftDetailsResponse.nft_token_details[0].image_url,
            date: '2022-03-19T13:34:25.000Z'
        })
        expect(axiosGetStub.callCount).to.eq(1)
        expect(axiosHeadStub.callCount).to.eq(0)
        expect(tokenDetailsStub.callCount).to.eq(1)
        expect(saveTokenStub.callCount).to.eq(1)

        //@ts-expect-error
        expect(web3GetBlockStub.callCount).to.eq(1)
    })
})