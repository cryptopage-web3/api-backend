import { inject, injectable } from "inversify";
import { ISocialComment, ICommunity, IBaseSocialPost, ISocialPost } from './types';
import { IDS } from '../../../types/index';
import Web3 from 'web3';

@injectable()
export class GoerliSocialSmartContract implements ICommunity {
    static communityContractAddress = '0x2d722a9853ac048ce220fadbf3cab45146d76af6'
    static cryptoPageNftContractAddress = '0x19962298f0b28be502ce83bd179eb212287ecb5d'

    @inject(IDS.NODE_MODULES.web3) _web3: Web3
    @inject(IDS.SERVICE.WEB3.CommunityWeb3SmartContract) private _web3CommunityContract

    async getCommentCount(tokenId: string): Promise<number> {
        const minABI:any[] = [
            { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getCommentCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
        ];
        
        const count = await this._web3CommunityContract.methods.getCommentCount(tokenId).call();

        return parseInt(count)
    }

    async getComments(contractAddress: string, tokenId: string): Promise<ISocialComment[]> {
        const count = await this.getCommentCount(tokenId)

        if(count === 0){
            return []
        }

        const comments:ISocialComment[] = [];
        for(let i = 1; i <= count && i <=10; i++){
            const comment = await this.getCommentFromBlockchain(tokenId, i)
            
            if(comment._owner === '0x0000000000000000000000000000000000000000'){
                return comments
            }

            comments.push(comment)
        }

        return comments
    }

    async getCommentFromBlockchain(tokenId: string, commentId: number):Promise<ISocialComment>{
        const comment = await this._web3CommunityContract.methods.readComment(tokenId, commentId).call();
        return (({ipfsHash, creator, _owner, price, isUp, isDown,isView}) => ({ipfsHash, creator, _owner, price, isUp, isDown,isView}))(comment)
    }

    async readPostForContract(contractAddress: string, tokenId: string): Promise<ISocialPost> {
        if(contractAddress != GoerliSocialSmartContract.cryptoPageNftContractAddress){
            return {} as ISocialPost
        }

        const post = await this._web3CommunityContract.methods.readPost(tokenId).call().catch(err => {
            if (!process.env.PREVENT_LOG_ERRORS) {
                console.error(`Failed to get readPost, contract: ${GoerliSocialSmartContract.communityContractAddress}, tokenId: ${tokenId}`, err.message)
            }

            return Promise.reject(err)
        });

        post.accessPrice = parseInt(post.accessPrice)
        post.accessDuration = parseInt(post.accessDuration)

        return post
    }
}