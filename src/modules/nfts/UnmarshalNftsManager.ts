import { INftsManager, INftsList, INftTransaction, NftTxType } from './types';
import { UnmarshalApi } from '../../services/unmarshal/UnmarhalApi';
import { inject, injectable } from 'inversify';
import { IDS } from '../../types/index';
import { ChainId } from '../transactions/types';
import { NftTokenDetailsRepo } from '../../orm/repo/nft-token-details-repo';
import { ContractDetailsRepo } from '../../orm/repo/contract-details-repo';
import { IWeb3Manager } from '../../services/web3/types';
import { ContractDetailsInferAttr } from '../../orm/model/contract-detail';
import { IUnmarshalNftTransaction } from '../../services/unmarshal/types';

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
    
    async getWalletNFTTransactions(address, page, pageSize) {
        const { list, count } = await this._unmarshalApi.getWalletNFTTransactions(address, page, pageSize);

        return {
            list: list.map(t => this._normalizeNftTransactions(t)),
            count
        }
    }

    _normalizeNftTransactions(data:IUnmarshalNftTransaction):INftTransaction {
        return {
            type: NftTxType.baseInfo,
            txHash: data.transaction_hash,
            blockNumber: data.block_number,
            contract_address: data.contract_address,
            tokenId: data.token_id,
            to: data.to,
            from: data.sender,
        }
    }

    async getNftTransactionDetails(contractAddress: string, tokenId: string, blockNumber:number) {
        const [tokenDetails, blockDate] = await Promise.all([
            this._getTokenDetails(this._chain, contractAddress, tokenId),
            this._web3Manager.getDateFromBlock(blockNumber)
        ])

        return Object.assign({},
            tokenDetails,
            {date: blockDate}
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