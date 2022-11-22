import { inject, injectable } from "inversify";
import { IDS } from '../../types/index';
import { NftTokenDetailsRepo } from '../../orm/repo/nft-token-details-repo';
import { IWeb3Manager } from '../../services/web3/types';
import { ChainId } from '../transactions/types';

import { GetTokenFromApiCallback } from './types';
import { ISocialSmartContract } from '../../services/social-smart-contract/types';

@injectable()
export class NftCache {
    @inject(IDS.ORM.REPO.NftTokenDetailsRepo) private _nftTokenRepo: NftTokenDetailsRepo
    @inject(IDS.SERVICE.SocialSmartContract) private _socialSmartContract: ISocialSmartContract

    async getNftTransactionDetails(web3Manager:IWeb3Manager,chain:ChainId, contractAddress: string, tokenId: string, blockNumber:number,getTokenFromApi: GetTokenFromApiCallback) {
        const [tokenDetails, blockDate, comments] = await Promise.all([
            this._getTokenDetails(web3Manager, chain, contractAddress, tokenId, getTokenFromApi),
            web3Manager.getDateFromBlock(blockNumber),
            this._socialSmartContract.getComments(tokenId)
        ])

        return Object.assign({},
            tokenDetails,
            {date: blockDate, comments}
        )
    }

    async _getTokenDetails(web3Manager:IWeb3Manager, chain: ChainId, contractAddress: string, tokenId: string, getTokenFromApi: GetTokenFromApiCallback ){
        /*const dbToken = await this._nftTokenRepo.getToken(chain, contractAddress, tokenId)

        if(dbToken){
            const result = dbToken.get({plain: true})
            
            const removeFields = ['id','createdAt','updatedAt']

            removeFields.forEach((key)=>{
                delete result[key]
            })

            return result
        }*/

        const minABI:any[] = [
           {"inputs":[{"internalType":"uint256","name":"postId","type":"uint256"}],"name":"readPost","outputs":[{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"uint64","name":"upCount","type":"uint64"},{"internalType":"uint64","name":"downCount","type":"uint64"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"commentCount","type":"uint256"},{"internalType":"address[]","name":"upDownUsers","type":"address[]"},{"internalType":"bool","name":"isView","type":"bool"},{"internalType":"bool","name":"isEncrypted","type":"bool"},{"internalType":"uint256","name":"accessPrice","type":"uint256"},{"internalType":"uint256","name":"accessDuration","type":"uint256"}],"stateMutability":"view","type":"function"}
        ];
        // @ts-ignore
        const contract = web3Manager._ethContractFactory(minABI, '0x2d722a9853ac048ce220fadbf3cab45146d76af6');
        const postInfo = await contract.methods.readPost(tokenId).call().catch(err => {
            if (!process.env.PREVENT_LOG_ERRORS) {
                console.error(`Failed to get readPost, contract: 0x2d722a9853ac048ce220fadbf3cab45146d76af6, tokenId: ${tokenId}`, err.message)
            }

            return Promise.reject(err)
        });

        const apiToken = await getTokenFromApi()

        const {
            isEncrypted,
            accessPrice,
            accessDuration
        } = postInfo

        const tokenData = {
            isEncrypted,
            accessPrice: parseInt(accessPrice),
            accessDuration: parseInt(accessDuration),

            tokenId,
            chain,
            contractAddress,
            contentUrl: apiToken.url,
            name: apiToken.name,
            description: apiToken.description,
            attributes: apiToken.attributes
        }
        
       /* this._nftTokenRepo.createToken(tokenData).catch(err =>{
            console.log('failed to save token data to database', err)
        })*/
        

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