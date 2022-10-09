import { inject, injectable } from "inversify";
import { ISocialSmartContract } from './types';
import { IDS } from '../../types/index';
import Web3 from 'web3';

const goerliSocialContractAddress = '0x2d722a9853ac048ce220fadbf3cab45146d76af6';

@injectable()
export class GoerliSocialSmartContract implements ISocialSmartContract{
    @inject(IDS.NODE_MODULES.web3) _web3: Web3

    async getCommentCount(tokenId: string): Promise<number> {
        const minABI:any[] = [
            { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getCommentCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
        ];
        this._web3.eth.handleRevert = true
        const contract = new this._web3.eth.Contract(minABI, goerliSocialContractAddress);
        const count = await contract.methods.getCommentCount(tokenId).call();

        return parseInt(count)
    }
}