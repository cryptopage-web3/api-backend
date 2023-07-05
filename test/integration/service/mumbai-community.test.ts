import { Container } from "inversify"
import Sinon, { SinonStub } from "sinon"
import { IDS } from "../../../src/types"
import { MumbaiCommunity } from '../../../src/services/web3/social-smart-contract/mumbai/mumbai-community';
import { testWeb3ContractFactory, TestWeb3Mock } from '../../mock/test-web3-mock';
import { expect } from "chai";

describe('polygon mumbai community',()=>{
    const container = new Container()

    let getPluginContractMethodStub: SinonStub
    let getPluginContractCallStub: SinonStub

    let readCommentMethodStub: SinonStub
    let readCommentCallStub: SinonStub

    before(()=>{
        getPluginContractMethodStub = Sinon.stub()
        getPluginContractCallStub = Sinon.stub()

        readCommentMethodStub = Sinon.stub()
        readCommentCallStub = Sinon.stub()

        container.bind(IDS.SERVICE.CryptoPageCommunity).to(MumbaiCommunity)
        
        container.bind(IDS.SERVICE.WEB3.CommunityWeb3SmartContract).toConstantValue({
            methods:{
                getPluginContract: getPluginContractMethodStub
            }
        })
    })

    beforeEach(()=>{
        getPluginContractMethodStub.returns({call: getPluginContractCallStub})
        container.snapshot()
    })

    afterEach(()=>{
        container.restore()
    })

    after(()=>{
        Sinon.restore()
    })

    it('should return 0 comments when contract address not matched',async ()=>{
        container.bind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => ()=> {})

        const community = container.get<MumbaiCommunity>(IDS.SERVICE.CryptoPageCommunity)
        
        const contractAddress = 'test_contract'

        const comments = await community.getComments(contractAddress, '1')

        expect(comments).to.be.a('array')
        expect(comments.length).to.be.eq(0)

        expect(getPluginContractCallStub.notCalled).to.be.true
    })

    it('should return 0 comments when no comments', async ()=>{
        const commentsPluginAddress = 'comments_plugin_address',
            tokenId = '101'

        getPluginContractCallStub.resolves(commentsPluginAddress)
        readCommentCallStub.resolves([])
        readCommentMethodStub.returns({ call: readCommentCallStub })

        container.bind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [MumbaiCommunity.communityContractAddress]: {
                getPluginContract: {method: getPluginContractMethodStub, call: getPluginContractCallStub}
            },
            [commentsPluginAddress]:{
                read: {method: readCommentMethodStub, call: readCommentCallStub}
            }
        }))

        const community = container.get<MumbaiCommunity>(IDS.SERVICE.CryptoPageCommunity);
        
        const comments = await community.getComments(MumbaiCommunity.cryptoPageNftContractAddress, tokenId)

        expect(comments).to.be.a('array')
        expect(comments.length).to.be.eq(0)

        expect(getPluginContractMethodStub.calledOnce).to.be.true
        expect(getPluginContractCallStub.calledOnce).to.be.true
        
        expect(readCommentMethodStub.calledOnceWith(tokenId)).to.be.true
        expect(readCommentCallStub.calledOnce).to.be.true
    })

    it('should return 1 comment', async ()=>{
        const commentsPluginAddress = 'comments_plugin_address',
            tokenId = '101',
            creator = '0x1', 
            owner = '0x2', 
            communityId = '0x3',
            timestamp = '0x4',
            gasConsumption = '0x5',
            isUp = true,
            isDown = false, 
            isView = true,
            isEncrypted = false,
            isGasCompensation = false,
            ipfsHash = '0x6'

        getPluginContractCallStub.resolves(commentsPluginAddress)

        readCommentCallStub.resolves([[creator, owner, communityId,timestamp,gasConsumption,isUp,isDown, isView,isEncrypted,isGasCompensation,ipfsHash]])

        container.bind(IDS.SERVICE.WEB3.ContractFactory).toFactory(context => testWeb3ContractFactory({
            [MumbaiCommunity.communityContractAddress]: {
                getPluginContract: {method: getPluginContractMethodStub, call: getPluginContractCallStub}
            },
            [commentsPluginAddress]:{
                read: {method: readCommentMethodStub, call: readCommentCallStub}
            }
        }))

        const community = container.get<MumbaiCommunity>(IDS.SERVICE.CryptoPageCommunity);
        
        const comments = await community.getComments(MumbaiCommunity.cryptoPageNftContractAddress, tokenId)

        expect(comments).to.be.a('array')
        expect(comments.length).to.be.eq(1)
        expect(comments[0]).deep.equal({
            creator, owner,timestamp, isUp, isDown, isView, isEncrypted, ipfsHash
        })

        expect(getPluginContractMethodStub.calledOnce).to.be.true
        expect(getPluginContractCallStub.calledOnce).to.be.true
        
        expect(readCommentMethodStub.calledOnceWith(tokenId)).to.be.true
        expect(readCommentCallStub.calledOnce).to.be.true
    })
})