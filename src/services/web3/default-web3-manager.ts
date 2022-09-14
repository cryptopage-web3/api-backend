import { IWeb3Manager } from './types';
import { ApiError } from '../../types/index';
import { injectable } from 'inversify';
import { NftTokenData } from 'modules/nfts/types';

@injectable()
export class DefaultWebManager implements IWeb3Manager {
    getTokenData(contrctAddress: string, tokenId: string): Promise<NftTokenData> {
        throw new ApiError('Method not implemented.');
    }
    getDateFromBlock(blocknum: number): Promise<Date> {
        throw new ApiError('Method not implemented.');
    }
    getFieldFromContract(address: string, key: string) {
        throw new ApiError('Method not implemented.');
    }
}