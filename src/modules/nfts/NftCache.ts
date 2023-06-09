import { inject, injectable } from "inversify";
import { IDS } from '../../types/index';
import { NftTokenDetailsRepo } from '../../orm/repo/nft-token-details-repo';
import { IWeb3Manager } from '../../services/web3/types';
import { ChainId } from '../transactions/types';

import { GetTokenFromApiCallback } from './types';
import { ISocialSmartContract } from '../../services/web3/social-smart-contract/types';

@injectable()
export class NftCache {
    @inject(IDS.ORM.REPO.NftTokenDetailsRepo) private _nftTokenRepo: NftTokenDetailsRepo
    @inject(IDS.SERVICE.SocialSmartContract) private _socialSmartContract: ISocialSmartContract

    async getNftTransactionDetails(web3Manager:IWeb3Manager,chain:ChainId, contractAddress: string, tokenId: string, blockNumber:number | null,getTokenFromApi: GetTokenFromApiCallback) {
        const [tokenDetails, blockDate, comments] = await Promise.all([
            this._getTokenDetails(chain, contractAddress, tokenId, getTokenFromApi),
            !!blockNumber ? web3Manager.getDateFromBlock(blockNumber) : undefined,
            this._socialSmartContract.getComments(tokenId)
        ])

        return Object.assign({},
            tokenDetails,
            {date: blockDate, comments}
        )
    }

    async _getTokenDetails(chain: ChainId, contractAddress: string, tokenId: string, getTokenFromApi: GetTokenFromApiCallback ){
        const dbToken = await this._nftTokenRepo.getToken(chain, contractAddress, tokenId)

        if(dbToken){
            const result = dbToken.get({plain: true})
            
            const removeFields = ['id','createdAt','updatedAt']

            removeFields.forEach((key)=>{
                delete result[key]
            })

            return result
        }

        const apiToken = await getTokenFromApi()

        const tokenData = {
            tokenId,
            chain,
            contractAddress,
            contentUrl: apiToken.contentUrl,
            name: apiToken.name,
            description: apiToken.description,
            attributes: apiToken.attributes,
            isEncrypted: !!apiToken.isEncrypted,
            accessPrice: apiToken.accessPrice?.toString(),
            accessDuration: apiToken.accessDuration
        }
        
        this._nftTokenRepo.createToken(tokenData).catch(err =>{
            console.log('failed to save token data to database', err)
        })

        return tokenData
    }

    /*async _getContrctDetails(chain: ChainId, contractAddress: string, tokenId: string, ){
        const dbContract = await this._contractsRepo.getContract(chain, contractAddress)

        if(dbContract){
            return dbContract.get({plain: true})
        }

        const apiContract = await this._unmarshalApi.getNFTDetailsFromApi(
            contractAddress, tokenId
        )
        
        const symbol = await this._web3Manager.getFieldFromContract(contractAddress,'symbol')
        
        const contractData:ContractDetailsInferAttr = {
            contractAddress,
            chain,
            name: apiContract.name,
            symbol,
            description: apiContract.description,
            url: apiContract.url
        }

        this._contractsRepo.createContract(contractData).catch(err =>{
            console.log('failed to save contract data to database', err)
        })

        return contractData
    }*/
}