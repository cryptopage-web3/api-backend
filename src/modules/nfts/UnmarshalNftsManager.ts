import { INftsManager, INftsList } from './types';
import { UnmarshalApi } from '../../services/unmarshal/UnmarhalApi';
import { inject, injectable } from 'inversify';
import { IDS } from '../../types/index';
import { ChainId } from '../transactions/types';
import { NftTokenDetailsRepo } from '../../orm/repo/nft-token-details-repo';
import { ContractDetailsRepo } from '../../orm/repo/contract-details-repo';
import { IWeb3Manager } from '../../services/web3/types';
import { ContractDetailsInferAttr } from '../../orm/model/contract-detail';

@injectable()
export class UnmarshalNftsManager implements INftsManager {
    @inject(IDS.ORM.REPO.NftTokenDetailsRepo) private _nftTokenRepo: NftTokenDetailsRepo
    @inject(IDS.ORM.REPO.ContractDetailsRepo) private _contractsRepo: ContractDetailsRepo    
    @inject(IDS.SERVICE.WEB3.Web3Manager) private _web3Manager: IWeb3Manager

    _unmarshalApi: UnmarshalApi
    _chain: ChainId
    
    constructor(
        @inject(IDS.SERVICE.UnmarshalApi) unmarshalApi: UnmarshalApi,
    ){
        this._unmarshalApi = unmarshalApi
    }

    getWalletAllNFTs(address, page, pageSize):Promise<INftsList> {
        return this._unmarshalApi.getWalletAllNFTs(address, page, pageSize);
    }
    
    getWalletNFTTransactions(address, page, pageSize) {
        return this._unmarshalApi.getWalletNFTTransactions(address, page, pageSize);
    }

    async getNftTransactionDetails(contractAddress: string, tokenId: string, blockNumber:number) {
        return Object.assign({},
            await this._getTokenDetails(this._chain, contractAddress, tokenId),
            await this._getContrctDetails(this._chain, contractAddress, tokenId)
        )
    }

    async _getTokenDetails(chain: ChainId, contractAddress: string, tokenId: string){
        const dbToken = await this._nftTokenRepo.getToken(this._chain, tokenId)

        if(dbToken){
            return dbToken.get({plain: true})
        }

        const apiToken = await this._unmarshalApi.getNFTDetailsFromApi(contractAddress, tokenId)

        const tokenData = {
            tokenId,
            chain,
            url: apiToken.url,
            type: apiToken.type,
            name: apiToken.name,
            description: apiToken.description,
            attributes: apiToken.attributes
        }

        if(apiToken.type){
            this._nftTokenRepo.createToken(tokenData).catch(err =>{
                console.log('failed to save token data to database', err)
            })
        }

        return tokenData
    }

    async _getContrctDetails(chain: ChainId, contractAddress: string, tokenId: string){
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
            chain: this._chain,
            name: apiContract.name,
            symbol,
            description: apiContract.description,
            url: apiContract.url
        }

        this._contractsRepo.createContract(contractData).catch(err =>{
            console.log('failed to save contract data to database', err)
        })

        return contractData
    }
}