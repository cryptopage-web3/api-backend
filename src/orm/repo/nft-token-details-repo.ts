import { NftTokenDetails, NftTokenDetailsInferAttr } from '../model/nft-token-details';
import { ChainId } from '../../modules/transactions/types';
import { injectable } from 'inversify';

@injectable()
export class NftTokenDetailsRepo {
    getToken(chain: ChainId, tokenId: string):Promise<NftTokenDetails | null>{
        return NftTokenDetails.findOne({ where:{ tokenId, chain} })
    }

    createToken(nftToken:NftTokenDetailsInferAttr){
        return NftTokenDetails.create(nftToken)
    }
}