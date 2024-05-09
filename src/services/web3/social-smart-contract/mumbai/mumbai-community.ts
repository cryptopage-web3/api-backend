import { inject, injectable } from "inversify";
import { ChainId } from "../../../../modules/transactions/types";
import { ErrorLogRepo } from "../../../../orm/repo/error-log-repo";
import { IDS } from "../../../../types";
import { ISocialComment, ISocialPost, ICommunity } from "../types";
import { mumbaiSingleReadAllCommentsAbi, mumbaiSingleReadPostAbi } from "./abi";
import { IChainConf } from "../constants";
import { isEqAddr } from "../../../../util/string-util";

@injectable()
export class MumbaiCommunity implements ICommunity {
    _chainId:ChainId

    @inject(IDS.SERVICE.WEB3.CommunityWeb3SmartContract) _web3CommunityContract
    @inject(IDS.SERVICE.WEB3.ContractFactory) _web3ContractFactory: Function
    @inject(IDS.ORM.REPO.ErrorLogRepo) _errorLogRepo: ErrorLogRepo

    @inject(IDS.CONFIG.SmartContractsConf) _smConf:IChainConf

    setChainId(chain:ChainId){
        this._chainId = chain;
    }

    async getCommentCount(tokenId: string): Promise<number> {
        throw new Error('method deprecated')
    }

    async readPostForContract(contractAddress: string, tokenId: string): Promise<ISocialPost>{
        if(!isEqAddr( contractAddress, this._smConf.cryptoPageNftContractAddress)){
            return {} as ISocialPost
        }

        const pluginAddress = await this._web3CommunityContract.methods.getPluginContract(
            this._smConf.plugins.singleReadPost.address, 1
        ).call()
        
        const readPostWeb3Contract = this._web3ContractFactory(mumbaiSingleReadPostAbi, pluginAddress, this._chainId)
        
        const post = await readPostWeb3Contract.methods.read(tokenId).call(), {
            isEncrypted, payAmount, commentCount, upCount, downCount, paymentType, ipfsHash, creator, minimalPeriod, timestamp
        } = post

        return { isEncrypted, payAmount, commentCount, upCount, downCount, paymentType, ipfsHash, creator, minimalPeriod, date: (new Date(parseInt(timestamp)*1000).toISOString()) }
    }

    async getComments(contractAddress: string, tokenId: string): Promise<ISocialComment[]> {
        if(!isEqAddr( contractAddress, this._smConf.cryptoPageNftContractAddress)){
            return []
        }

        const pluginAddress = await this._web3CommunityContract.methods.getPluginContract(
            this._smConf.plugins.singleReadAllComments.address, 1
        ).call().catch(err =>{
            this._errorLogRepo.log('mumbai_community_get_plugin_read_all_comments', err.message,{
                pluginAddress: this._smConf.plugins.singleReadAllComments.address
            })

            return Promise.reject(err)
        })

        const readCommentsWeb3Contract = this._web3ContractFactory(
            mumbaiSingleReadAllCommentsAbi, pluginAddress, this._chainId
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