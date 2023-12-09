import { inject, injectable } from "inversify";
import { IDS } from '../../types/index';
import { NftTokenDetailsRepo } from '../../orm/repo/nft-token-details-repo';
import { ChainId } from '../transactions/types';

import { Web3NftTokenData } from './types';

@injectable()
export class NftCache {
    @inject(IDS.ORM.REPO.NftTokenDetailsRepo) private _nftTokenRepo: NftTokenDetailsRepo
    @inject(IDS.CONFIG.EnableNftCache) _isCacheEnabled: boolean
/*
    async getNftTransactionDetails(web3Manager:IWeb3Manager,chain:ChainId, contractAddress: string, tokenId: string, blockNumber:number | null,getTokenFromApi: GetTokenFromApiCallback) {
        const [tokenDetails, blockDate, comments] = await Promise.all([
            this._getTokenDetails(chain, contractAddress, tokenId, getTokenFromApi),
            !!blockNumber ? web3Manager.getDateFromBlock(blockNumber) : undefined,
            this._socialSmartContract.getComments(contractAddress, tokenId)
        ])

        return Object.assign({},
            tokenDetails,
            {date: blockDate, comments}
        )
    }*/

    async getTokenDetails(chain: ChainId, contractAddress: string, tokenId: string ){
        if(this._isCacheEnabled){
            const dbToken = await this._nftTokenRepo.getToken(chain, contractAddress, tokenId)

            if(dbToken){
                const result = dbToken.get({plain: true})
                
                const removeFields = ['id','createdAt','updatedAt']

                removeFields.forEach((key)=>{
                    delete result[key]
                })

                return result
            }
        }
        
        return null
    }

    async saveTokenData(chain:ChainId, token:Web3NftTokenData){
        if(!this._isCacheEnabled){
            return
        }

        const tokenData = {
            tokenId: token.tokenId,
            chain,
            contractAddress: token.contractAddress,
            creator: token.creator,
            contentUrl: token.contentUrl,
            name: token.name,
            description: token.description,
            attributes: token.attributes,
            attachments: token.attachments,
            isEncrypted: !!token.isEncrypted,
            payAmount: token.payAmount?.toString(),
            paymentType: token.paymentType || 0,
            minimalPeriod: token.minimalPeriod
        }
        
        this._nftTokenRepo.createToken(tokenData).catch(err =>{
            console.log('failed to save token data to database', err)
        })
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