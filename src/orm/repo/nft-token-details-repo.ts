import { NftTokenDetails, NftTokenDetailsCreateAttr } from '../model/nft-token-details';
import { ChainId } from '../../modules/transactions/types';
import { injectable } from 'inversify';
import { Op } from 'sequelize';

@injectable()
export class NftTokenDetailsRepo {
    getToken(chain: ChainId, contractAddress:string, tokenId: string):Promise<NftTokenDetails | null>{
        return NftTokenDetails.findOne({ where:{ tokenId, chain, contractAddress} })
    }

    createToken(nftToken:NftTokenDetailsCreateAttr){
        return NftTokenDetails.create(nftToken)
    }

    removeOldRecords(ttlInMinutes: number){
        const removeDate = new Date()
        removeDate.setMinutes(removeDate.getMinutes() - ttlInMinutes)

        return NftTokenDetails.destroy({
            where:{ createdAt:{[Op.lte]: removeDate}}
        })
    }
}