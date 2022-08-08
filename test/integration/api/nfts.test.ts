require('dotenv').config()

import "reflect-metadata"

import { InversifyExpressServer } from 'inversify-express-utils';
import { agent } from "supertest";
import { container } from '../../../src/ioc';
import { Axios } from 'axios';
import { IDS } from '../../../src/types/index';
import { unmarshalEthNftsResponse } from './nfts-response';

const app = new InversifyExpressServer(container).build()
const testAgent = agent(app)

jest.mock('axios')

const axios:Axios = container.get(IDS.NODE_MODULES.axios)

describe('test nfts api endpoints', ()=>{
    afterEach(()=>{
        jest.resetAllMocks()
    })

    it.only('should return eth nfts', async ()=>{
        (axios.get as jest.Mock)
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

})