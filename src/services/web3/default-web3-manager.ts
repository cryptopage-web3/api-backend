import { IWeb3Manager } from './types';
import { ApiError } from '../../types/index';
import { injectable } from 'inversify';
import { Web3NftTokenData } from 'modules/nfts/types';
import { ChainId } from '../../modules/transactions/types';

@injectable()
export class DefaultWebManager implements IWeb3Manager {
    setChainId(chainId: ChainId) {
        
    }
    getTokenData(contrctAddress: string, tokenId: string): Promise<Web3NftTokenData> {
        throw new ApiError('Method not implemented.');
    }
    getDateFromBlock(blocknum: number): Promise<Date> {
        throw new ApiError('Method not implemented.');
    }
    getFieldFromContract(address: string, key: string) {
        throw new ApiError('Method not implemented.');
    }
}