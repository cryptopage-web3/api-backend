import { cleanUpMetadata, InversifyExpressServer } from 'inversify-express-utils';
import { agent, SuperAgentTest } from "supertest";
import { Axios } from 'axios';
import { IDS } from '../../../src/types/index';
import { unmarshalEthNftsResponse, unmarshalNftTransactionsEmptyResponse, unmarshalEthNftTransactionsResponse, unmarshalMaticNftsResponse, unmarshalBscNtsResponse, unmarshalNtsEmptyResponse, unmarshalMaticNftTransactionsResponse, unmarshalBscNfttransactionsResponse, unmarshalEthNftDetailsResponse, unmarshalMaticNftDetailsResponse, unmarshalBscNftDetailsResponse, goerlyErrorResponse, goerliNftTransactionsResponse, goerliNftListTransactionsResponse, alchemyAddressNftsResponse, alchemyNftTransfersResponse, goerliNftComment, mumbaiAlchemyAddressNftsResponse, mumbaiAlchemyAddressNftTransactionsResponse, mumbaiAlchemyNftMetadataResponse, maticAlchemyAddressNftsResponse, maticAlchemyNftMetadataResponse } from './nfts-response';
import Sinon, { SinonStub } from 'sinon';
import { expect } from 'chai';
import { testContainer } from '../../ioc/test-container';
import { testWeb3ContractFactory as testWeb3ContractFactory, TestWeb3Mock } from '../../mock/test-web3-mock';
import { interfaces } from 'inversify';
import { TestAlchemyMock } from '../../mock/test-alchemy-mock';
import { AssetTransfersCategory } from 'alchemy-sdk';
import { ChainId } from '../../../src/modules/transactions/types';
import { NftTokenDetails } from '../../../src/orm/model/nft-token-details';
import { GoerliSocialSmartContract } from '../../../src/services/web3/social-smart-contract/goerli-social-smart-contract';
import { BlockDetails } from '../../../src/orm/model/block-details';
import { Application } from 'express';
import { NftTxType } from '../../../src/modules/nfts/types';
import { PostStatisticRepo } from '../../../src/orm/repo/post-statistic-repo';
import { maticSmartContracts, mumbaiSmartContracts } from '../../../src/services/web3/social-smart-contract/constants';
import { TestAxiosMock } from '../../mock/test-axios-mock';

let app: Application
let testAgent: SuperAgentTest

let getCacheTokenDetailsStub: SinonStub
let saveTokenStub: SinonStub 
let getBlockDetailsStub: SinonStub
let saveBlockDetailsStub: SinonStub

describe('test nfts api endpoints', ()=>{
    before(async ()=>{
        await import ('../../../src/controller/nft-controller')
        app = new InversifyExpressServer(testContainer).build()
        testAgent = agent(app)

        
        getCacheTokenDetailsStub = Sinon.stub(NftTokenDetails, 'findOne')
        saveTokenStub = Sinon.stub(NftTokenDetails, 'create')
        getBlockDetailsStub = Sinon.stub(BlockDetails, 'findOne')
        saveBlockDetailsStub = Sinon.stub(BlockDetails, 'create')
    })
    after(()=>{
        cleanUpMetadata()
        Sinon.restore()
    })
    beforeEach(()=>{
        testContainer.snapshot()
    })
    afterEach(()=>{
        testContainer.restore()
        //testContainer.rebind(IDS.NODE_MODULES.axios).toConstantValue(TestAxiosMock)
        //console.log('after ntst each')
    })
    it.skip('should return eth nfts', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

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
                tokenId: '8561',
                contentUrl: unmarshalEthNftsResponse.nft_assets[0].issuer_specific_data.image_url
            }))

            expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it.skip('should return polygon nfts unmarshal', async () => {
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

        axiosGetStub
            .resolves({data: unmarshalMaticNftsResponse})

        const response = await testAgent
            .get('/nfts/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)

        expect(axiosGetStub.calledOnce).to.eq(true)

        expect(response.body.count).to.eq(102)
        expect(response.body.list).to.be.an('array')
        expect(response.body.list.length).to.eq(4)
        expect(response.body.list[0]).to.contain(({
            contractAddress: '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
            from: '0xb7f8d0b571f9fc79e896c778ccdff2f92279ac21',
            to: '0xBA7089b207205c1B2282A18c1C80E856Fd424de0',
            tokenId: '1267276096787188443380565843485598748588859320258549594955629332512307718469',
            contentUrl: unmarshalMaticNftsResponse.nft_assets[0].issuer_specific_data.image_url
        }))
    })

    it('should return matic nfts alchemy', async () => {
        const axios:TestAxiosMock = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

        const getPluginContractMethodStub = Sinon.stub(),
            getPluginCommentsContractCall = Sinon.stub(),
            getPluginPostContractCall = Sinon.stub(),
            readCommentsContractAddress = 'read_comments_address',
            readPostContractAddress = 'read_post_contract_address',
            readCommentsMethod = Sinon.stub(),
            readCommentsCall = Sinon.stub(),
            readPostMethod = Sinon.stub(),
            readPostCall = Sinon.stub()

        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [maticSmartContracts.communityContract.address]:{
                getPluginContract:{ method: getPluginContractMethodStub }
            },
            [readCommentsContractAddress]:{
                read:{method:readCommentsMethod, call: readCommentsCall}
            },
            [readPostContractAddress]:{
                read:{ method: readPostMethod, call: readPostCall}
            }
        }))

        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.matic)
             
        const getNftsForOwnerStub = Sinon.stub(alchemy.nft, 'getNftsForOwner')

        getNftsForOwnerStub.resolves(maticAlchemyAddressNftsResponse)
        getPluginContractMethodStub
            .withArgs(maticSmartContracts.plugins.singleReadAllComments.address, 1).returns({call: getPluginCommentsContractCall})
            .withArgs(maticSmartContracts.plugins.singleReadPost.address, 1).returns({call: getPluginPostContractCall})
        
        getPluginCommentsContractCall.resolves(readCommentsContractAddress)
        getPluginPostContractCall.resolves(readPostContractAddress)
            
        readCommentsCall.resolves([])
        readPostCall.resolves({ipfsHash:'test_hash', timestamp: '1704709767'})

        axiosGetStub.callsFake(url =>{
            return Promise.resolve({data: {contentUrl2: url}})
        })

        const walletAddress = '0x7d9d209f124dffb488308a1350001c353ba04afb'

        const response = await testAgent
            .get(`/nfts/matic/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(getNftsForOwnerStub.calledOnce).to.eq(true)
        expect(getPluginContractMethodStub.callCount).to.eq(10)
        expect(readPostCall.callCount).to.eq(5)
        expect(readCommentsCall.callCount).to.eq(5)

        expect(response.body.count).to.eq(5)
        expect(response.body.list).to.be.an('array')
        expect(response.body.list.length).to.eq(5)
        
        expect(axiosGetStub.callCount).to.eq(5)

        expect(response.body.list[1]).to.contain(({
            name: maticAlchemyAddressNftsResponse.ownedNfts[1].rawMetadata.name,
            symbol: maticAlchemyAddressNftsResponse.ownedNfts[1].contract.symbol,
            contractAddress: maticAlchemyAddressNftsResponse.ownedNfts[1].contract.address,
            tokenId: maticAlchemyAddressNftsResponse.ownedNfts[1].tokenId,
            contentUrl: maticAlchemyAddressNftsResponse.ownedNfts[1].media[0].raw,
        }))
        expect(response.body.list[1].comments).to.be.a('array')
        expect(response.body.list[1].comments.length).to.eq(0)
    })

    it('should return mumbai nfts', async () => {
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')
        
        const getPluginContractMethodStub = Sinon.stub(),
            getPluginCommentsContractCall = Sinon.stub(),
            getPluginPostContractCall = Sinon.stub(),
            readCommentsContractAddress = 'read_comments_address',
            readPostContractAddress = 'read_post_contract_address',
            readCommentsMethod = Sinon.stub(),
            readCommentsCall = Sinon.stub(),
            readPostMethod = Sinon.stub(),
            readPostCall = Sinon.stub()

        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [mumbaiSmartContracts.communityContract.address]:{
                getPluginContract:{ method: getPluginContractMethodStub }
            },
            [readCommentsContractAddress]:{
                read:{method:readCommentsMethod, call: readCommentsCall}
            },
            [readPostContractAddress]:{
                read:{ method: readPostMethod, call: readPostCall}
            }
        }))

        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.mumbai)
             
        const getNftsForOwnerStub = Sinon.stub(alchemy.nft, 'getNftsForOwner')

        getNftsForOwnerStub.resolves(mumbaiAlchemyAddressNftsResponse)
        getPluginContractMethodStub
            .withArgs(mumbaiSmartContracts.plugins.singleReadAllComments.address, 1).returns({call: getPluginCommentsContractCall})
            .withArgs(mumbaiSmartContracts.plugins.singleReadPost.address, 1).returns({call: getPluginPostContractCall})
        
        getPluginCommentsContractCall.resolves(readCommentsContractAddress)
        getPluginPostContractCall.resolves(readPostContractAddress)
            
        readCommentsCall.resolves([])
        readPostCall.resolves({ipfsHash:'test_hash', timestamp: '1704709767'})

        axiosGetStub.callsFake(url =>{
            return Promise.resolve({data: {contentUrl2: url}})
        })

        const walletAddress = '0x7d9d209f124dffb488308a1350001c353ba04afb'

        const response = await testAgent
            .get(`/nfts/mumbai/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.count).to.eq(5)
        expect(response.body.list).to.be.an('array')
        expect(response.body.list.length).to.eq(5)
        
        expect(axiosGetStub.callCount).to.eq(5)

        expect(response.body.list[1]).to.contain(({
            name: mumbaiAlchemyAddressNftsResponse.ownedNfts[1].rawMetadata.name,
            symbol: mumbaiAlchemyAddressNftsResponse.ownedNfts[1].contract.symbol,
            contractAddress: mumbaiAlchemyAddressNftsResponse.ownedNfts[1].contract.address,
            tokenId: mumbaiAlchemyAddressNftsResponse.ownedNfts[1].tokenId,
            contentUrl: mumbaiAlchemyAddressNftsResponse.ownedNfts[1].media[0].raw,
        }))
        expect(response.body.list[1].comments).to.be.a('array')
        expect(response.body.list[1].comments.length).to.eq(0)

        expect(getNftsForOwnerStub.calledOnce).to.eq(true)
        expect(getPluginContractMethodStub.callCount).to.eq(10)
        expect(readPostCall.callCount).to.eq(5)
        expect(readCommentsCall.callCount).to.eq(5)
    })

    it.skip('should return bsc nfts', async () => {
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

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
            tokenId: '166401',
            contentUrl: unmarshalBscNtsResponse.nft_assets[0].issuer_specific_data.image_url
        }))

        expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it.skip('should return goerli nfts', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

        let alchemyGetNftsStub:SinonStub
        
        testContainer.onActivation(IDS.SERVICE.AlchemySdk, function(context:interfaces.Context, instance:TestAlchemyMock){
            alchemyGetNftsStub = Sinon.stub(instance.nft, 'getNftsForOwner')
            alchemyGetNftsStub.resolves(alchemyAddressNftsResponse)
            return instance
        })

        const getCommentsCountMethodStub = Sinon.stub()
        const readCommentMethodStub = Sinon.stub()

        const getCommentsCountStub = Sinon.stub()
        const readCommentStub = Sinon.stub()

        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory)
            .toFactory(context => testWeb3ContractFactory({
                ['0x4bd1c8dc0a34d9cbb5c73d1126ee5f523ba798db']:{
                    getCommentCount: {method: getCommentsCountMethodStub, call: getCommentsCountStub},
                    readComment: {method: readCommentMethodStub, call: readCommentStub}
                }
            }))
        
        getCommentsCountStub
            .onCall(0).resolves('0')
            .onCall(1).resolves('1')
        
        readCommentStub.resolves(goerliNftComment)

        const response = await testAgent
            .get(`/nfts/goerli/0x4bd1c8dc0a34d9cbb5c73d1126ee5f523ba798db`)
            .expect('Content-Type',/json/)

        //@ts-expect-error
        expect(alchemyGetNftsStub.calledOnce).to.be.true
        expect(axiosGetStub.callCount).to.be.eq(0)
        
        expect(getCommentsCountMethodStub.calledTwice).to.be.true
        expect(getCommentsCountMethodStub.calledWith(alchemyAddressNftsResponse.ownedNfts[0].tokenId)).to.be.true
        expect(getCommentsCountMethodStub.calledWith(alchemyAddressNftsResponse.ownedNfts[1].tokenId)).to.be.true
        expect(getCommentsCountStub.calledTwice).to.be.true
        
        expect(readCommentMethodStub.calledOnce).to.be.true
        expect(readCommentMethodStub.calledWith(alchemyAddressNftsResponse.ownedNfts[1].tokenId, 1)).to.be.true
        expect(readCommentStub.calledOnce).to.be.true

        expect(response.body.list.length).to.eq(2)
        expect(response.body.list[0]).contain({
            "name": "nft show",
            "symbol": "PAGE.NFT",
            "description": "token 19 descr",
            "contract_address": "0x19962298f0b28be502ce83bd179eb212287ecb5d",
            "tokenId": "19",
            contentUrl: alchemyAddressNftsResponse.ownedNfts[0].media[0]?.gateway
        })
        expect(response.body.list[0].comments).to.be.a('array').that.is.empty

        expect(response.body.list[1]).contain({
            "name": "crypto.page",
            "symbol": "PAGE.NFT",
            "description": "",
            "contract_address": "0x19962298f0b28be502ce83bd179eb212287ecb5d",
            "tokenId": "20",
            contentUrl: alchemyAddressNftsResponse.ownedNfts[1].media[0]?.gateway
        })
        expect(response.body.list[1].comments).to.deep.equal([goerliNftComment])
    })

    it.skip('should not return error eth nfts', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

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

    it.skip('should not return error matic nfts unmarshal', async () => {
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

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

    it('should not return error matic nfts alchemy', async () => {
        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [maticSmartContracts.communityContract.address]:{},
        }))

        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.matic)
             
        const getNftsForOwnerStub = Sinon.stub(alchemy.nft, 'getNftsForOwner')

        getNftsForOwnerStub.resolves({totalCount:0, ownedNfts:[]})

        const walletAddress = '0x7d9d209f124dffb488308a1350001c353ba04afb'

        const response = await testAgent
            .get(`/nfts/matic/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.count).to.eq(0)
        expect(response.body.list).to.be.an('array')
        expect(response.body.list.length).to.eq(0)

        expect(getNftsForOwnerStub.calledOnce).to.eq(true)
    })

    it('should not return error mumbai nfts', async () => {
        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [mumbaiSmartContracts.communityContract.address]:{},
        }))

        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.mumbai)
             
        const getNftsForOwnerStub = Sinon.stub(alchemy.nft, 'getNftsForOwner')

        getNftsForOwnerStub.resolves({totalCount:0, ownedNfts:[]})

        const walletAddress = '0x7d9d209f124dffb488308a1350001c353ba04afb'

        const response = await testAgent
            .get(`/nfts/mumbai/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.count).to.eq(0)
        expect(response.body.list).to.be.an('array')
        expect(response.body.list.length).to.eq(0)

        expect(getNftsForOwnerStub.calledOnce).to.eq(true)
    })

    it.skip('should not return error bsc nfts', async () => {
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

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

    it.skip('should return eth nft transactions', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

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

    it.skip('should return goerli nft transactions', async ()=>{
        let alchemyGetNftTransfersStub:SinonStub
        
        testContainer.onActivation(IDS.SERVICE.AlchemySdk, function(context:interfaces.Context, instance:TestAlchemyMock){
            alchemyGetNftTransfersStub = Sinon.stub(instance.core, 'getAssetTransfers')
            alchemyGetNftTransfersStub.resolves(alchemyNftTransfersResponse)
            return instance
        })

        const getCommentsCountMethodStub = Sinon.stub()
        const readCommentMethodStub = Sinon.stub()

        const getCommentsCountStub = Sinon.stub()
        const readCommentStub = Sinon.stub()

        const goerliNftAddress = '0x2aDe7E7ed11a4E35C2dDCCB6189d4fE710A165f5'

        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory)
            .toFactory(context => testWeb3ContractFactory({
                [goerliNftAddress]: {
                    getCommentCount: {method: getCommentsCountMethodStub, call:getCommentsCountStub},
                    readComment: {method: readCommentMethodStub, call:readCommentStub},
                }
            }))

        getCommentsCountStub
            .onCall(0).resolves('0')
            .onCall(1).resolves('1')
        
        readCommentStub.resolves(goerliNftComment)

        const response = await testAgent
            .get(`/nfts/transactions/goerli/${goerliNftAddress}?pageSize=10&continue[pageKey]=pageKey1`)
            .expect('Content-Type',/json/)

        expect(response.body.continue.pageKey).to.be.eq('pageKey2')
        expect(response.body.list).to.be.an('array')
        expect(response.body.count).to.be.undefined
        expect(response.body.list.length).to.eq(2)
        expect(response.body.list[0]).to.contain(({
            from: alchemyNftTransfersResponse.transfers[0].from,
            to: alchemyNftTransfersResponse.transfers[0].to,
            blockNumber: 16,
            tokenId: '1'
        }))
        expect(response.body.list[1]).to.contain(({
            from: alchemyNftTransfersResponse.transfers[1].from,
            to: alchemyNftTransfersResponse.transfers[1].to,
            blockNumber: 22,
            tokenId: '2'
        }))

        //@ts-expect-error
        expect(alchemyGetNftTransfersStub.calledOnce).to.be.true
        //@ts-expect-error
        expect(alchemyGetNftTransfersStub.getCall(0).args[0]).deep.equal({
            toAddress: goerliNftAddress,
            category: [AssetTransfersCategory.ERC721, AssetTransfersCategory.ERC1155],
            withMetadata: true,
            maxCount: 10,
            pageKey: 'pageKey1'
        })

        expect(getCommentsCountStub.calledTwice).to.be.true
        expect(getCommentsCountMethodStub.calledWith('1')).to.be.true
        expect(getCommentsCountMethodStub.calledWith('2')).to.be.true

        expect(readCommentStub.calledOnce).to.be.true
        expect(readCommentMethodStub.calledOnceWith('contract_2', '2'))
    })

    it.skip('should return matic nft transactions unmarshal', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

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

    it('should return matic nft transactions alchemy', async () => {
        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [maticSmartContracts.communityContract.address]:{}
        }))
        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.matic)
             
        const getAssetTransfers = Sinon.stub(alchemy.core, 'getAssetTransfers')

        getAssetTransfers.resolves(mumbaiAlchemyAddressNftTransactionsResponse)

        const walletAddress = '0x7d9d209f124dffb488308a1350001c353ba04afb'

        const response = await testAgent
            .get(`/nfts/transactions/matic/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.transactions).to.be.an('array')
        expect(response.body.transactions.length).to.eq(5)
        expect(response.body.transactions[0]).to.contain(({
            type: NftTxType.baseInfo,
            txHash: mumbaiAlchemyAddressNftTransactionsResponse.transfers[0].hash,
            blockNumber: parseInt(mumbaiAlchemyAddressNftTransactionsResponse.transfers[0].blockNum),
            contractAddress: mumbaiAlchemyAddressNftTransactionsResponse.transfers[0].rawContract.address,
            tokenId: '80001000000000052',
            to: mumbaiAlchemyAddressNftTransactionsResponse.transfers[0].to,
            from: mumbaiAlchemyAddressNftTransactionsResponse.transfers[0].from,
        }))

        expect(getAssetTransfers.calledOnce).to.eq(true)
        expect(getAssetTransfers.getCall(0).args.at(0)).to.contain({
            toAddress: walletAddress
        })
    })


    it('should return mumbai nft transactions', async () => {
        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [mumbaiSmartContracts.communityContract.address]:{}
        }))
        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.mumbai)
             
        const getAssetTransfers = Sinon.stub(alchemy.core, 'getAssetTransfers')

        getAssetTransfers.resolves(mumbaiAlchemyAddressNftTransactionsResponse)

        const walletAddress = '0x7d9d209f124dffb488308a1350001c353ba04afb'

        const response = await testAgent
            .get(`/nfts/transactions/mumbai/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.transactions).to.be.an('array')
        expect(response.body.transactions.length).to.eq(5)
        expect(response.body.transactions[0]).to.contain(({
            type: NftTxType.baseInfo,
            txHash: mumbaiAlchemyAddressNftTransactionsResponse.transfers[0].hash,
            blockNumber: parseInt(mumbaiAlchemyAddressNftTransactionsResponse.transfers[0].blockNum),
            contractAddress: mumbaiAlchemyAddressNftTransactionsResponse.transfers[0].rawContract.address,
            tokenId: '80001000000000052',
            to: mumbaiAlchemyAddressNftTransactionsResponse.transfers[0].to,
            from: mumbaiAlchemyAddressNftTransactionsResponse.transfers[0].from,
        }))

        expect(getAssetTransfers.calledOnce).to.eq(true)
        expect(getAssetTransfers.getCall(0).args.at(0)).to.contain({
            toAddress: walletAddress
        })
    })

    it.skip('should return bsc nft transactions', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

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

    it.skip('should not return error eth nfts transactions', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

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

    it.skip('should not return error matic nft transactions unmarshal', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

        axiosGetStub.resolves({data: unmarshalNftTransactionsEmptyResponse})

        const response = await testAgent
            .get('/nfts/transactions/matic/0xBA7089b207205c1B2282A18c1C80E856Fd424de0')
            .expect('Content-Type',/json/)

        expect(Array.isArray(response.body.list)).to.eq(true)
        expect(response.body.count).to.eq(0)
        expect(response.body.list.length).to.eq(0)

        expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it('should not return error matic nft transactions alchemy', async () => {
        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [maticSmartContracts.communityContract.address]:{}
        }))
        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.matic)
             
        const getAssetTransfers = Sinon.stub(alchemy.core, 'getAssetTransfers')

        getAssetTransfers.resolves({transfers:[]})

        const walletAddress = '0x7d9d209f124dffb488308a1350001c353ba04afb'

        const response = await testAgent
            .get(`/nfts/transactions/matic/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.transactions).to.be.an('array')
        expect(response.body.transactions.length).to.eq(0)

        expect(getAssetTransfers.calledOnce).to.eq(true)
        expect(getAssetTransfers.getCall(0).args.at(0)).to.contain({
            toAddress: walletAddress
        })
    })

    it('should not return error mumbai nft transactions', async () => {
        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [mumbaiSmartContracts.communityContract.address]:{}
        }))
        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.mumbai)
             
        const getAssetTransfers = Sinon.stub(alchemy.core, 'getAssetTransfers')

        getAssetTransfers.resolves({transfers:[]})

        const walletAddress = '0x7d9d209f124dffb488308a1350001c353ba04afb'

        const response = await testAgent
            .get(`/nfts/transactions/mumbai/${walletAddress}`)
            .expect('Content-Type',/json/)

        expect(response.body.transactions).to.be.an('array')
        expect(response.body.transactions.length).to.eq(0)

        expect(getAssetTransfers.calledOnce).to.eq(true)
        expect(getAssetTransfers.getCall(0).args.at(0)).to.contain({
            toAddress: walletAddress
        })
    })

    it.skip('should not return error bsc nft transactions', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

        axiosGetStub.resolves({data: unmarshalNftTransactionsEmptyResponse})

        const response = await testAgent
            .get('/nfts/transactions/bsc/0x2465176C461AfB316ebc773C61fAEe85A6515DAA')
            .expect('Content-Type',/json/)

        expect(Array.isArray(response.body.list)).to.eq(true)
        expect(response.body.count).to.eq(0)
        expect(response.body.list.length).to.eq(0)

        expect(axiosGetStub.calledOnce).to.eq(true)
    })

    it.skip('should return eth nfts transaction details', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

        const web3Factory: Function = testContainer.get(IDS.NODE_MODULES.web3Factory)
        const web3: TestWeb3Mock = web3Factory(ChainId.eth)
        const web3GetBlockStub:SinonStub = Sinon.stub(web3.eth, 'getBlock')
    
        web3GetBlockStub.resolves({timestamp: 1659947419})
        axiosGetStub.resolves({data: unmarshalEthNftDetailsResponse})
        saveTokenStub.resolves()
        getCacheTokenDetailsStub.resolves(null)
        getBlockDetailsStub.resolves(null)
        saveBlockDetailsStub.resolves()
    
        const contractAddress = '0x495f947276749ce646f68ac8c248420045cb7b5e',
            tokenId = '86322540947695616051707333350443506684962566151002367173878109827558281315304',
            blockNumber = 15300497
    
        const response = await testAgent
            .get(`/nfts/transaction/eth/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)
    
        expect(response.body).contain({
            tokenId,
            contentUrl: unmarshalEthNftDetailsResponse.nft_token_details[0].image_url,
            date: '2022-08-08T08:30:19.000Z'
        })
        expect(axiosGetStub.callCount).to.eq(1)
        expect(web3GetBlockStub.callCount).to.eq(1)
        expect(getCacheTokenDetailsStub.callCount).to.eq(1)
        expect(saveTokenStub.callCount).to.eq(1)
        expect(getBlockDetailsStub.callCount).to.eq(2)
        expect(saveBlockDetailsStub.callCount).to.eq(1)
    })

    it.skip('should return matic nft transaction details unmarshal', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

        const web3Factory: Function = testContainer.get(IDS.NODE_MODULES.web3Factory)
        const web3: TestWeb3Mock = web3Factory(ChainId.matic)
        const web3GetBlockStub:SinonStub = Sinon.stub(web3.eth, 'getBlock')
    
        web3GetBlockStub.resolves({timestamp: 1659520065})
        axiosGetStub.resolves({data: unmarshalMaticNftDetailsResponse})
        saveTokenStub.resolves()
        getCacheTokenDetailsStub.resolves(null)
        getBlockDetailsStub.resolves(null)
        saveBlockDetailsStub.resolves()
    
        const contractAddress = '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
            tokenId = '78965343665950388415519985342127408390054350375949077399659463369044632110752',
            blockNumber = 31467970
    
        const response = await testAgent
            .get(`/nfts/transaction/matic/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)
    
        expect(response.body).contain({
            tokenId,
            contentUrl: unmarshalMaticNftDetailsResponse.nft_token_details[0].image_url,
            date: '2022-08-03T09:47:45.000Z'
        })
        expect(axiosGetStub.callCount).to.eq(1)
        expect(web3GetBlockStub.callCount).to.eq(1)
        expect(getCacheTokenDetailsStub.callCount).to.eq(1)
        expect(saveTokenStub.callCount).to.eq(1)
        expect(getBlockDetailsStub.callCount).to.eq(2)
        expect(saveBlockDetailsStub.callCount).to.eq(1)
    })

    it('should return matic nft transaction details alchemy', async () => {
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

        const getPluginContractMethodStub = Sinon.stub(),
            getPostContractAddressCall = Sinon.stub(),
            getCommentsContractAddressCall = Sinon.stub(),
            readCommentsContractAddress = 'read_comments_address',
            readPostAddress = 'read_post_address',
            readCommentsMethod = Sinon.stub(),
            readCommentsCall = Sinon.stub(),
            readPostMethod = Sinon.stub(),
            readPostCall = Sinon.stub()

        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [maticSmartContracts.communityContract.address]:{
                getPluginContract:{ method: getPluginContractMethodStub}
            },
            [readCommentsContractAddress]:{
                read:{method:readCommentsMethod, call: readCommentsCall}
            },
            [readPostAddress]:{
                read: {method: readPostMethod, call: readPostCall }
            }
        }))

        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.matic)
             
        const getNftMetadata = Sinon.stub(alchemy.nft, 'getNftMetadata')

        const web3Factory: Function = testContainer.get(IDS.NODE_MODULES.web3Factory)
        const web3: TestWeb3Mock = web3Factory(ChainId.matic)
        const web3GetBlockStub:SinonStub = Sinon.stub(web3.eth, 'getBlock')
    
        const tokenMetaResponse = {data: {image: 'image_content_or_url', name: 'test token',description:'Crypto.Page NFT'}}

        web3GetBlockStub.resolves({timestamp: 1659520065})
        axiosGetStub.resolves(tokenMetaResponse)
        getNftMetadata.resolves(maticAlchemyNftMetadataResponse)
        getPluginContractMethodStub
            .withArgs(maticSmartContracts.plugins.singleReadPost.address, 1).returns({call: getPostContractAddressCall})
            .withArgs(maticSmartContracts.plugins.singleReadAllComments.address, 1).returns({call: getCommentsContractAddressCall})
        
        getPostContractAddressCall.resolves(readPostAddress)
        getCommentsContractAddressCall.resolves(readCommentsContractAddress)
        readCommentsCall.onCall(0).resolves([]).onCall(1).throws('unexpeted call')
        readPostCall.resolves({isEncrypted:true, payAmount: 10, paymentType: 1, minimalPeriod: 250, timestamp: '1704709767' })
        getCacheTokenDetailsStub.resolves(null)
        saveTokenStub.resolves()

        const contractAddress = maticSmartContracts.cryptoPageNftContractAddress,
            tokenId = '80001000000000052',
            blockNumber = 31467970

        const response = await testAgent
            .get(`/nfts/transaction/matic/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)

        expect(getNftMetadata.callCount).to.eq(1)
        expect(getNftMetadata.getCall(0).args).deep.equal([contractAddress, tokenId])
        expect(readCommentsCall.callCount).to.be.eq(1)
        expect(readPostCall.callCount).to.be.eq(1)
        expect(saveTokenStub.calledOnce).to.be.true
        expect(web3GetBlockStub.calledOnce).to.be.true
        expect(getCacheTokenDetailsStub.calledOnce).to.be.true
        expect(saveTokenStub.getCall(0).args[0]).contain({
            minimalPeriod: 250
        })

        expect(response.body).contain({
            tokenId,
            contractAddress,
            name: tokenMetaResponse.data.name,
            description: tokenMetaResponse.data.description,
            contentUrl: tokenMetaResponse.data.image,
            isEncrypted: true,
            minimalPeriod: 250,
            date: '2022-08-03T09:47:45.000Z'
        })
    })

    it('should return mumbai nft transaction details', async () => {
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')


        const getPluginContractMethodStub = Sinon.stub(),
            getPostContractAddressCall = Sinon.stub(),
            getCommentsContractAddressCall = Sinon.stub(),
            readCommentsContractAddress = 'read_comments_address',
            readPostAddress = 'read_post_address',
            readCommentsMethod = Sinon.stub(),
            readCommentsCall = Sinon.stub(),
            readPostMethod = Sinon.stub(),
            readPostCall = Sinon.stub()

        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [mumbaiSmartContracts.communityContract.address]:{
                getPluginContract:{ method: getPluginContractMethodStub}
            },
            [readCommentsContractAddress]:{
                read:{method:readCommentsMethod, call: readCommentsCall}
            },
            [readPostAddress]:{
                read: {method: readPostMethod, call: readPostCall }
            }
        }))

        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.mumbai)
             
        const getNftMetadata = Sinon.stub(alchemy.nft, 'getNftMetadata')

        const web3Factory: Function = testContainer.get(IDS.NODE_MODULES.web3Factory)
        const web3: TestWeb3Mock = web3Factory(ChainId.mumbai)
        const web3GetBlockStub:SinonStub = Sinon.stub(web3.eth, 'getBlock')
    
        const tokenMetaResponse = {data: {image: 'image_content_or_url', name: 'test token',description:'Crypto.Page NFT'}}

        web3GetBlockStub.resolves({timestamp: 1659520065})
        axiosGetStub.resolves(tokenMetaResponse)
        getNftMetadata.resolves(mumbaiAlchemyNftMetadataResponse)
        getPluginContractMethodStub
            .withArgs(mumbaiSmartContracts.plugins.singleReadPost.address, 1).returns({call: getPostContractAddressCall})
            .withArgs(mumbaiSmartContracts.plugins.singleReadAllComments.address, 1).returns({call: getCommentsContractAddressCall})
        
        getPostContractAddressCall.resolves(readPostAddress)
        getCommentsContractAddressCall.resolves(readCommentsContractAddress)
        readCommentsCall.onCall(0).resolves([]).onCall(1).throws('unexpeted call')
        readPostCall.resolves({isEncrypted:true, payAmount: 10, paymentType: 1, minimalPeriod: 250, timestamp: '1704709767' })
        getCacheTokenDetailsStub.resolves(null)
        saveTokenStub.resolves()

        const contractAddress = '0xc0fc66ba41bea0a1266c681bbc781014e7c67612',
            tokenId = '80001000000000052',
            blockNumber = 31467970

        const response = await testAgent
            .get(`/nfts/transaction/mumbai/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)

        expect(getNftMetadata.callCount).to.eq(1)
        expect(getNftMetadata.getCall(0).args).deep.equal([contractAddress, tokenId])
        expect(readCommentsCall.callCount).to.be.eq(1)
        expect(readPostCall.callCount).to.be.eq(1)
        expect(saveTokenStub.calledOnce).to.be.true
        expect(web3GetBlockStub.calledOnce).to.be.true
        expect(getCacheTokenDetailsStub.calledOnce).to.be.true
        expect(saveTokenStub.getCall(0).args[0]).contain({
            minimalPeriod: 250
        })

        expect(response.body).contain({
            tokenId,
            contractAddress,
            name: tokenMetaResponse.data.name,
            description: tokenMetaResponse.data.description,
            contentUrl: tokenMetaResponse.data.image,
            isEncrypted: true,
            minimalPeriod: 250,
            date: '2022-08-03T09:47:45.000Z'
        })
    })

    it.skip('should return bsc nft transaction details', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get'),
            axiosHeadStub: SinonStub = Sinon.stub(axios, 'head')

        const web3Factory: Function = testContainer.get(IDS.NODE_MODULES.web3Factory)
        const web3: TestWeb3Mock = web3Factory(ChainId.bsc)
        const web3GetBlockStub:SinonStub = Sinon.stub(web3.eth, 'getBlock')
    
        web3GetBlockStub.resolves({timestamp: 1647696865})
        axiosGetStub.resolves({data: unmarshalBscNftDetailsResponse})
        saveTokenStub.resolves()
        getCacheTokenDetailsStub.resolves(null)
        getBlockDetailsStub.resolves(null)
        saveBlockDetailsStub.resolves()
    
        const contractAddress = '0x7dcdefb5f0844619ac16bcd5f36c3014efa90931',
            tokenId = '340282366920938463463374607431768211749',
            blockNumber = 16196556
    
        const response = await testAgent
            .get(`/nfts/transaction/bsc/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)
    
        expect(response.body).contain({
            tokenId,
            contentUrl: unmarshalBscNftDetailsResponse.nft_token_details[0].image_url,
            date: '2022-03-19T13:34:25.000Z'
        })
        expect(axiosGetStub.callCount).to.eq(1)
        expect(axiosHeadStub.callCount).to.eq(0)
    
        expect(getCacheTokenDetailsStub.callCount).to.eq(1)
        expect(saveTokenStub.callCount).to.eq(1)

        expect(web3GetBlockStub.callCount).to.eq(1)
        expect(getBlockDetailsStub.callCount).to.eq(2)
        expect(saveBlockDetailsStub.callCount).to.eq(1)
    })

    it.skip('should return goerli nfts transaction details', async ()=>{
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')
            
        const contractAddress = GoerliSocialSmartContract.cryptoPageNftContractAddress,
            tokenId = '64',
            blockNumber = 15300497

        const web3Factory: Function = testContainer.get(IDS.NODE_MODULES.web3Factory)
        const web3: TestWeb3Mock = web3Factory(ChainId.goerli)
        const web3GetBlockStub = Sinon.stub(web3.eth, 'getBlock')
    
        const getTokenUriMethodStub = Sinon.stub()
        const getTokenUriCallStub = Sinon.stub()
    
        const getCommentsCountMethodStub = Sinon.stub()
        const readCommentMethodStub = Sinon.stub()

        const getReadPostNethodStub = Sinon.stub()
        const callReadPostMethodStub = Sinon.stub()
    
        web3GetBlockStub.resolves({timestamp: 1659947419})
        getCacheTokenDetailsStub.resolves(null)
        saveTokenStub.resolves()
        getBlockDetailsStub.resolves(null)
        saveBlockDetailsStub.resolves()
    
        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory)
            .toFactory(context => testWeb3ContractFactory({
                [contractAddress]:{
                    tokenURI: {method: getTokenUriMethodStub, call: getTokenUriCallStub},
                    getCommentCount: {method: getCommentsCountMethodStub, call: readCommentMethodStub},
                    readPost: {method: getReadPostNethodStub, call: callReadPostMethodStub}
                }
            }))
    
        const tokenUri = 'http://test.uri'
        const tokenData = {
            image: 'http://token_image.url',
            name:'test token name',
            description:'test toked descr',
            attributes:[{attr1:'test1'}]
        }
        const postData = { isEncrypted: false, accessPrice: 135, accessDuration: 120}
    
        axiosGetStub.resolves({data: tokenData})
        getTokenUriCallStub.resolves(tokenUri)
        readCommentMethodStub.resolves(0)
        callReadPostMethodStub.resolves(postData)
    
        
    
        const response = await testAgent
            .get(`/nfts/transaction/goerli/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)
    
        expect(response.body).deep.equal({
            "tokenId": "64",
            "chain": "goerli",
            "contractAddress": contractAddress,
            "contentUrl": tokenData.image,
            "name": tokenData.name,
            "description": tokenData.description,
            "attributes": tokenData.attributes,
            "isEncrypted": postData.isEncrypted,
            "accessPrice": postData.accessPrice.toString(),
            "accessDuration": postData.accessDuration,
            "date": "2022-08-08T08:30:19.000Z",
            comments: []
        })
    
        expect(getCommentsCountMethodStub.calledOnceWith(tokenId)).to.be.true
        expect(readCommentMethodStub.calledOnce).to.be.true
        
        expect(getReadPostNethodStub.calledOnceWith(tokenId)).to.be.true
        expect(callReadPostMethodStub.calledOnce).to.be.true
    
        expect(axiosGetStub.callCount).to.eq(1)
        expect(getCacheTokenDetailsStub.callCount).to.eq(1)
        expect(saveTokenStub.callCount).to.eq(1)
    
        expect(web3GetBlockStub.callCount).to.eq(1)
        expect(web3GetBlockStub.getCall(0).args).to.deep.equal([blockNumber.toString()])
    
        expect(getTokenUriMethodStub.calledOnceWith(tokenId)).to.be.true
        expect(getTokenUriCallStub.calledOnce).to.be.true
    
        expect(axiosGetStub.calledOnceWith(tokenUri)).to.be.true
        expect(getBlockDetailsStub.callCount).to.eq(2)
        expect(saveBlockDetailsStub.callCount).to.eq(1)
    })

    it.skip('should return error goerli nfts transaction details', async ()=>{
        process.env.PREVENT_LOG_ERRORS = 'yes'

        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

        const contractAddress = '0x495f947276749ce646f68ac8c248420045cb7b5e',
            tokenId = '86322540947695616051707333350443506684962566151002367173878109827558281315304',
            blockNumber = 15300497

        const web3Factory: Function = testContainer.get(IDS.NODE_MODULES.web3Factory)
        const web3: TestWeb3Mock = web3Factory(ChainId.goerli)
        const web3GetBlockStub = Sinon.stub(web3.eth, 'getBlock')
    
        const getTokenUriMethodStub = Sinon.stub()
        const getTokenUriCallStub = Sinon.stub()
    
        const getCommentsCountMethodStub = Sinon.stub()
        const readCommentMethodStub = Sinon.stub()
    
        web3GetBlockStub.resolves({timestamp: 1659947419})
    
        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory)
            .toFactory(context => testWeb3ContractFactory({
                [contractAddress]:{
                    tokenURI: {
                        method: getTokenUriMethodStub,
                        call: getTokenUriCallStub
                    },
                    getCommentCount: {
                        method: getCommentsCountMethodStub,
                        call: readCommentMethodStub
                    }
                }
            }))
    
        const tokenUri = 'http://test.uri'
    
        axiosGetStub.rejects({message:'Test axios error message'})
        getTokenUriCallStub.resolves(tokenUri)
        readCommentMethodStub.resolves(0)
        getBlockDetailsStub.resolves(null)
        saveBlockDetailsStub.resolves()
    
        
    
        const response = await testAgent
            .get(`/nfts/transaction/goerli/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)
    
        expect(response.body).contain({
            message: 'Unexpected error'
        })
    
        expect(getCommentsCountMethodStub.calledOnceWith(tokenId)).to.be.true
        expect(readCommentMethodStub.calledOnce).to.be.true
    
        expect(axiosGetStub.callCount).to.eq(1)
    
        expect(web3GetBlockStub.callCount).to.eq(1)
        expect(web3GetBlockStub.getCall(0).args).to.deep.equal([blockNumber.toString()])
    
        expect(getTokenUriMethodStub.calledOnceWith(tokenId)).to.be.true
        expect(getTokenUriCallStub.calledOnce).to.be.true
    
        expect(axiosGetStub.calledOnceWith(tokenUri)).to.be.true
        expect(getBlockDetailsStub.callCount).to.eq(2)
        expect(saveBlockDetailsStub.callCount).to.eq(1)
    
        Sinon.resetHistory()
    
        getTokenUriCallStub.rejects({message: 'failed to get token uri test error'})
    
        const response2 = await testAgent
            .get(`/nfts/transaction/goerli/details/${contractAddress}/${tokenId}/${blockNumber}`)
            .expect('Content-Type',/json/)
    
        expect(response2.body).contain({
            message: 'Unexpected error'
        })
    
        expect(getTokenUriMethodStub.calledOnceWith(tokenId)).to.be.true
        expect(getTokenUriCallStub.calledOnce).to.be.true
    
        expect(axiosGetStub.callCount).to.eq(0)
    
        expect(web3GetBlockStub.callCount).to.eq(1)
        expect(web3GetBlockStub.getCall(0).args).to.deep.equal([blockNumber.toString()])
    
        expect(getTokenUriMethodStub.calledOnceWith(tokenId)).to.be.true
        expect(getTokenUriCallStub.calledOnce).to.be.true
    
        expect(axiosGetStub.callCount).to.eq(0)
        expect(getBlockDetailsStub.callCount).to.eq(2)
        expect(saveBlockDetailsStub.callCount).to.eq(1)
    })

    it('should return mumbai nft token details', async () => {
        const axios:Axios = testContainer.get(IDS.NODE_MODULES.axios), 
            axiosGetStub: Sinon.SinonStub = Sinon.stub(axios, 'get')

        const getPluginContractMethodStub = Sinon.stub(),
            getPostContractAddressCall = Sinon.stub(),
            getCommentsContractAddressCall = Sinon.stub(),
            readCommentsContractAddress = 'read_comments_address',
            readPostAddress = 'read_post_address',
            readCommentsMethod = Sinon.stub(),
            readCommentsCall = Sinon.stub(),
            readPostMethod = Sinon.stub(),
            readPostCall = Sinon.stub()

        testContainer.rebind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [mumbaiSmartContracts.communityContract.address]:{
                getPluginContract:{ method: getPluginContractMethodStub}
            },
            [readCommentsContractAddress]:{
                read:{method:readCommentsMethod, call: readCommentsCall}
            },
            [readPostAddress]:{
                read: {method: readPostMethod, call: readPostCall }
            }
        }))

        const alchemy:TestAlchemyMock = testContainer.get<Function>(IDS.SERVICE.AlchemySdkFactory)(ChainId.mumbai)
             
        const getNftMetadata = Sinon.stub(alchemy.nft, 'getNftMetadata')
            
        const tokenMetaResponse = {data: {image: 'image_content_or_url', name: 'test token',description:'Crypto.Page NFT'}}

        axiosGetStub.resolves(tokenMetaResponse)
        getNftMetadata.resolves(mumbaiAlchemyNftMetadataResponse)
        getPluginContractMethodStub
            .withArgs(mumbaiSmartContracts.plugins.singleReadPost.address, 1).returns({call: getPostContractAddressCall})
            .withArgs(mumbaiSmartContracts.plugins.singleReadAllComments.address, 1).returns({call: getCommentsContractAddressCall})
        
        getPostContractAddressCall.resolves(readPostAddress)
        getCommentsContractAddressCall.resolves(readCommentsContractAddress)
        readCommentsCall.onCall(0).resolves([]).onCall(1).throws('unexpeted call')
        readPostCall.resolves({isEncrypted:true, payAmount: 10, paymentType: 1, minimalPeriod: 250, timestamp: '1704709767' })
        saveTokenStub.resolves()

        const contractAddress = '0xc0fc66ba41bea0a1266c681bbc781014e7c67612',
            tokenId = '80001000000000151'

        const response = await testAgent
            .get(`/nfts/token-details/mumbai/contract/${contractAddress}/token/${tokenId}`)
            .expect('Content-Type',/json/)

        expect(getNftMetadata.calledOnce).to.eq(true)
        expect(getNftMetadata.getCall(0).args).deep.equal([contractAddress, tokenId])
        expect(readCommentsCall.callCount).to.be.eq(1)
        expect(readPostCall.callCount).to.be.eq(1)
        expect(saveTokenStub.calledOnce).to.be.true
        expect(getCacheTokenDetailsStub.calledOnce).to.be.true
        expect(saveTokenStub.getCall(0).args[0]).contain({
            minimalPeriod: 250
        })

        expect(response.body).contain({
            tokenId,
            contractAddress,
            name: tokenMetaResponse.data.name,
            description: tokenMetaResponse.data.description,
            contentUrl: tokenMetaResponse.data.image,
            isEncrypted: true,
            minimalPeriod: 250,
        })
    })

    it('should return last nft tokens dashboard', async() =>{
        const repo = testContainer.get<PostStatisticRepo>(IDS.ORM.REPO.PostStatisticRepo),
            getDashboardStub = Sinon.stub(repo, 'getDashboard')

        getDashboardStub.returns([{
            postId: '80001000000000015',
            totalCommentsCount: 3
        },{
            postId: '80001000000000016',
            totalCommentsCount: 6
        }] as any)

        const response = await testAgent
            .get(`/nfts/dashboard/mumbai?page=2&pageSize=3`)
            .expect('Content-Type',/json/)

        expect(response.body.tokens).to.be.an('array')
        expect(response.body.tokens.length).to.eq(2)
        expect(response.body.tokens[0]).to.contain({
            tokenId: '80001000000000015',
            commentsCount: 3
        })
        expect(response.body.tokens[1]).to.contain({
            tokenId: '80001000000000016',
            commentsCount: 6
        })

        expect(getDashboardStub.calledOnce).to.be.true
        expect(getDashboardStub.getCall(0).args[0]).to.be.eq('mumbai')
        expect(getDashboardStub.getCall(0).args[1]).to.be.eq(2)
        expect(getDashboardStub.getCall(0).args[2]).to.be.eq(3)
    })

})