import { inject, injectable } from "inversify";
import { ChainId } from "../../../../modules/transactions/types";
import { IDS } from "../../../../types";
import { ISocialComment, ISocialPost, ICommunity } from "../types";
import { mumbaiSingleReadAllCommentsAbi, mumbaiSingleReadPostAbi } from "./abi";

@injectable()
export class MumbaiCommunity implements ICommunity {
    static communityContractAddress = '0x7E754F7D127eea39a3F7078ad4a8e9c61D6cD534'
    static cryptoPageNftContractAddress = '0xc0FC66bA41BEa0A1266C681bbC781014E7c67612'
    
    static plugins = {
        singleReadPost: '0x9e5224d23f22a6d0daa46d942305d0c94d3739ee0bd58cb2725e2f7f71c2ff73',
        singleReadAllComments: '0x4109142687fb920f2169e9f03a6c4544f567cb8d156347cdfbdb34b589e10879'
    }

    @inject(IDS.SERVICE.WEB3.CommunityWeb3SmartContract) _web3CommunityContract
    @inject(IDS.SERVICE.WEB3.EthContractFactory) _web3ContractFactory: Function

    async getCommentCount(tokenId: string): Promise<number> {
        throw new Error('method deprecated')
    }

    async readPostForContract(contractAddress: string, tokenId: string): Promise<ISocialPost>{
        if(contractAddress != MumbaiCommunity.cryptoPageNftContractAddress){
            return {} as ISocialPost
        }

        const pluginAddress = await this._web3CommunityContract.methods.getPluginContract(
            MumbaiCommunity.plugins.singleReadPost, 1
        ).call()
        
        const readPostWeb3Contract = this._web3ContractFactory(mumbaiSingleReadPostAbi, pluginAddress, ChainId.mumbai)
        
        return readPostWeb3Contract.methods.read(tokenId).call()
    }

    async getComments(contractAddress: string, tokenId: string): Promise<ISocialComment[]> {
        if(contractAddress !== MumbaiCommunity.cryptoPageNftContractAddress){
            return []
        }

        const pluginAddress = await this._web3CommunityContract.methods.getPluginContract(
            MumbaiCommunity.plugins.singleReadAllComments, 1
        ).call()

        const readCommentsWeb3Contract = this._web3ContractFactory(
            mumbaiSingleReadAllCommentsAbi, pluginAddress, ChainId.mumbai
        )

        return readCommentsWeb3Contract.methods.read(tokenId).call()
    }
}