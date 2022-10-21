import { inject, injectable } from "inversify";
import { ISocialComment, ISocialSmartContract } from './types';
import { IDS } from '../../types/index';
import Web3 from 'web3';

@injectable()
export class GoerliSocialSmartContract implements ISocialSmartContract{
    @inject(IDS.NODE_MODULES.web3) _web3: Web3

    @inject(IDS.SERVICE.WEB3.EthContract) private _socialEthContract

    async getCommentCount(tokenId: string): Promise<number> {
        const minABI:any[] = [
            { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getCommentCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
        ];
        
        const count = await this._socialEthContract.methods.getCommentCount(tokenId).call();

        return parseInt(count)
    }

    async getComments(tokenId: string): Promise<ISocialComment[]> {
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
        const comment = await this._socialEthContract.methods.readComment(tokenId, commentId).call();
        return (({ipfsHash, creator, _owner, price, isUp, isDown,isView}) => ({ipfsHash, creator, _owner, price, isUp, isDown,isView}))(comment)
    }
}