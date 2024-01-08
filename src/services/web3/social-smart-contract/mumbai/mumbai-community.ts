import { inject, injectable } from "inversify";
import { ChainId } from "../../../../modules/transactions/types";
import { ErrorLogRepo } from "../../../../orm/repo/error-log-repo";
import { IDS } from "../../../../types";
import { ISocialComment, ISocialPost, ICommunity } from "../types";
import { mumbaiSingleReadAllCommentsAbi, mumbaiSingleReadPostAbi } from "./abi";

@injectable()
export class MumbaiCommunity implements ICommunity {
    static communityContractAddress = '0x7e754f7d127eea39a3f7078ad4a8e9c61d6cd534'
    static cryptoPageNftContractAddress = '0xc0fc66ba41bea0a1266c681bbc781014e7c67612'
    
    static plugins = {
        singleReadPost: '0x9e5224d23f22a6d0daa46d942305d0c94d3739ee0bd58cb2725e2f7f71c2ff73',
        singleReadAllComments: '0x4109142687fb920f2169e9f03a6c4544f567cb8d156347cdfbdb34b589e10879'
    }

    @inject(IDS.SERVICE.WEB3.CommunityWeb3SmartContract) _web3CommunityContract
    @inject(IDS.SERVICE.WEB3.ContractFactory) _web3ContractFactory: Function
    @inject(IDS.ORM.REPO.ErrorLogRepo) _errorLogRepo: ErrorLogRepo

    async getCommentCount(tokenId: string): Promise<number> {
        throw new Error('method deprecated')
    }

    async readPostForContract(contractAddress: string, tokenId: string): Promise<ISocialPost>{
        if(contractAddress.toLowerCase() != MumbaiCommunity.cryptoPageNftContractAddress){
            return {} as ISocialPost
        }

        const pluginAddress = await this._web3CommunityContract.methods.getPluginContract(
            MumbaiCommunity.plugins.singleReadPost, 1
        ).call()
        
        const readPostWeb3Contract = this._web3ContractFactory(mumbaiSingleReadPostAbi, pluginAddress, ChainId.mumbai)
        
        const post = await readPostWeb3Contract.methods.read(tokenId).call(), {
            isEncrypted, payAmount, commentCount, upCount, downCount, paymentType, ipfsHash, creator, minimalPeriod, timestamp
        } = post

        return { isEncrypted, payAmount, commentCount, upCount, downCount, paymentType, ipfsHash, creator, minimalPeriod, date: (new Date(parseInt(timestamp)*1000).toISOString()) }
    }

    async getComments(contractAddress: string, tokenId: string): Promise<ISocialComment[]> {
        if(contractAddress !== MumbaiCommunity.cryptoPageNftContractAddress){
            return []
        }

        const pluginAddress = await this._web3CommunityContract.methods.getPluginContract(
            MumbaiCommunity.plugins.singleReadAllComments, 1
        ).call().catch(err =>{
            this._errorLogRepo.log('mumbai_community_get_plugin_read_all_comments', err.message,{
                pluginAddress: MumbaiCommunity.plugins.singleReadAllComments
            })

            return Promise.reject(err)
        })

        const readCommentsWeb3Contract = this._web3ContractFactory(
            mumbaiSingleReadAllCommentsAbi, pluginAddress, ChainId.mumbai
        )

        const comments = await readCommentsWeb3Contract.methods.read(tokenId).call().catch(err =>{
            this._errorLogRepo.log('mumbai_community_read_all_comments', err.message,{
                contractAddress: pluginAddress,
                tokenId,
                method: 'read'
            })

            return Promise.reject(err)
        })

        return comments.map((
            [ creator, owner, communityId,timestamp,gasConsumption,isUp,isDown, isView,isEncrypted,isGasCompensation,ipfsHash]
            ) => (
            { creator, owner,timestamp, isUp, isDown, isView, isEncrypted, ipfsHash }
        ))
    }
}