import { GoerliSocialSmartContract } from '../../../src/services/web3/social-smart-contract/goerli-social-smart-contract';
import { IDS } from '../../../src/types/index';
import { Container } from 'inversify';
import Sinon from 'sinon';
import { expect } from 'chai';
import { ISocialComment } from '../../../src/services/web3/social-smart-contract/types';

const container = new Container()

const getCommentsCountMethodStub = Sinon.stub()
const getCommentsCountCallStub = Sinon.stub()
const readCommentMethodStub = Sinon.stub()
const readCommentCallStub = Sinon.stub()

container.bind(IDS.SERVICE.WEB3.SocialEthSmartContract)
    .toDynamicValue(context => ({ methods:{
        getCommentCount: getCommentsCountMethodStub,
        readComment: readCommentMethodStub
    }}))
container.bind(IDS.SERVICE.SocialSmartContract).to(GoerliSocialSmartContract);
container.bind(IDS.NODE_MODULES.web3).toConstantValue({eth:{Contract:function(){}}})

const socialSmartContract:GoerliSocialSmartContract = container.get(IDS.SERVICE.SocialSmartContract);

describe('test goerli social smart contract', ()=>{
    beforeEach(()=>{
        getCommentsCountMethodStub.returns({ call: getCommentsCountCallStub})
        readCommentMethodStub.returns({ call: readCommentCallStub})
    })

    it('should return empty comment list', async ()=>{
        const tokenId = 'test_token_id'
        getCommentsCountCallStub.returns(0)
        
        const comments = await socialSmartContract.getComments(tokenId)

        expect(comments).to.be.a('array')
        expect(comments.length).to.be.eq(0)
        expect(getCommentsCountCallStub.calledOnce).to.be.true
        expect(getCommentsCountMethodStub.calledOnceWith(tokenId)).to.be.true
    })

    it('should return 2 comments', async ()=>{
        const tokenId = 'test_token_id'

        function commentGenerator(call:number):ISocialComment{
            return {
                _owner: `owner ${call}`,
                creator: `creator ${call}`,
                ipfsHash: `ipfsHash ${call}`,
                isDown: call % 1 !== 0,
                isUp: call % 1 === 0,
                price: `price ${call}`,
                isView: call %1 == 0
            }
        }
        
        getCommentsCountCallStub.returns(2)
        readCommentCallStub
            .onCall(0).returns(commentGenerator(0))
            .onCall(1).returns(commentGenerator(1))
        
        const comments = await socialSmartContract.getComments(tokenId)

        expect(comments).to.be.a('array')
        expect(comments.length).to.be.eq(2)
        expect(comments[0]).contain(commentGenerator(0))
        expect(comments[1]).contain(commentGenerator(1))
        
        expect(getCommentsCountCallStub.calledOnce).to.be.true
        expect(getCommentsCountMethodStub.calledOnceWith(tokenId)).to.be.true
        
        expect(readCommentMethodStub.calledTwice).to.be.true
        expect(readCommentMethodStub.getCall(0).args[0]).to.be.eq(tokenId)
        expect(readCommentMethodStub.getCall(0).args[1]).to.be.eq(1)
        expect(readCommentMethodStub.getCall(1).args[0]).to.be.eq(tokenId)
        expect(readCommentMethodStub.getCall(1).args[1]).to.be.eq(2)

        expect(readCommentCallStub.calledTwice).to.be.true
    })
})