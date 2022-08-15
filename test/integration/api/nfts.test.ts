require('dotenv').config()

import "reflect-metadata"

import { InversifyExpressServer } from 'inversify-express-utils';
import { agent } from "supertest";
import { container } from '../../../src/ioc';
import { Axios } from 'axios';
import { IDS } from '../../../src/types/index';
import { unmarshalEthNftsResponse, unmarshalNftTransactionsEmptyResponse, unmarshalEthNftTransactionsResponse, unmarshalMaticNftsResponse, unmarshalBscNtsResponse } from './nfts-response';

const app = new InversifyExpressServer(container).build()
const testAgent = agent(app)

jest.mock('axios')

const axios:Axios = container.get(IDS.NODE_MODULES.axios)
const axiosGetMock = axios.get as jest.Mock

describe('test nfts api endpoints', ()=>{
    afterEach(()=>{
        jest.resetAllMocks()
    })

    it('should return eth nfts', async ()=>{
        axiosGetMock
            .mockResolvedValueOnce({data: unmarshalEthNftsResponse})

        const response = await testAgent
            .get('/nfts/eth/0xb29c388e3fd63e1050ac5e4ca1d046dca36f004c')
            .expect('Content-Type',/json/)

            expect(Array.isArray(response.body.list)).toBe(true)
            expect(response.body.count).toBe(13)
            expect(response.body.list.length).toBe(10)
            expect(response.body.list[0]).toEqual(expect.objectContaining({
                from: '0x8b27de7f6a7542ee70e2420e1bc67fc479d01984',
                to: '0xb29c388e3fd63e1050ac5e4ca1d046dca36f004c',
                //name: 'v1 punk #8561',
                tokenId: '8561'
            }))

            expect((axios.get as jest.Mock).mock.calls.length).toBe(1)
    })

    it('should return polygon nfts', async () => {
        axiosGetMock
            .mockResolvedValueOnce({data: unmarshalMaticNftsResponse})

        const response = await testAgent
            .get('/nfts/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)

            expect(response.body.count).toBe(102)
            expect(Array.isArray(response.body.list)).toBe(true)
            expect(response.body.list.length).toBe(4)
            expect(response.body.list[0]).toEqual(expect.objectContaining({
                contract_address: '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
                from: '0xb7f8d0b571f9fc79e896c778ccdff2f92279ac21',
                to: '0xBA7089b207205c1B2282A18c1C80E856Fd424de0',
                tokenId: '1267276096787188443380565843485598748588859320258549594955629332512307718469'
            }))

            expect(axiosGetMock.mock.calls.length).toBe(1)
    })

    it('should return bsc nfts', async () => {
        axiosGetMock
            .mockResolvedValueOnce({data: unmarshalBscNtsResponse})

        const response = await testAgent
            .get('/nfts/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)

            expect(response.body.count).toBe(2)
            expect(Array.isArray(response.body.list)).toBe(true)
            expect(response.body.list.length).toBe(2)
            expect(response.body.list[0]).toEqual(expect.objectContaining({
                contract_address: '0x3d7b0001e03096d3795fd5d984ad679467546d73',
                from: '0x3c284a074afe106adbc1b6eeea1c15983eafdc47',
                to: '0x2465176C461AfB316ebc773C61fAEe85A6515DAA',
                tokenId: '166401'
            }))

            expect(axiosGetMock.mock.calls.length).toBe(1)
    })


    it('should not return error eth nfts transactions', async ()=>{
        axiosGetMock
            .mockResolvedValueOnce({data: unmarshalNftTransactionsEmptyResponse})

        const response = await testAgent
            .get('/nfts/transactions/eth/0x2aDe7E7ed11a4E35C2dDCCB6189d4fE710A165f5')
            .expect('Content-Type',/json/)

            expect(Array.isArray(response.body.list)).toBe(true)
            expect(response.body.count).toBe(0)
            expect(response.body.list.length).toBe(0)

            expect((axios.get as jest.Mock).mock.calls.length).toBe(1)
    })

    it('should return eth nft transactions', async ()=>{
        axiosGetMock.mockResolvedValue({data: unmarshalEthNftTransactionsResponse})

        const response = await testAgent
            .get('/nfts/transactions/eth/0x2aDe7E7ed11a4E35C2dDCCB6189d4fE710A165f5')
            .expect('Content-Type',/json/)

        expect(Array.isArray(response.body.list)).toBe(true)
        expect(response.body.count).toBe(24)
        expect(response.body.list.length).toBe(10)
        expect(response.body.list[0]).toEqual(expect.objectContaining({
            from: '0xb000953624c10427ad028510cf3249388ffdf310',
            to: '0xb29c388e3fd63e1050ac5e4ca1d046dca36f004c',
            blockNumber: 15300497,
            tokenId: '86322540947695616051707333350443506684962566151002367173878109827558281315304'
        }))

        expect(axiosGetMock.mock.calls.length).toBe(1)
    })
})