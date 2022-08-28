import { IWeb3Manager } from './types';
import { ApiError } from '../../types/index';
import { injectable } from 'inversify';

@injectable()
export class DefaultWebManager implements IWeb3Manager {
    getDateFromBlock(blocknum: number): Promise<Date> {
        throw new ApiError('Method not implemented.');
    }
    getFieldFromContract(address: string, key: string) {
        throw new ApiError('Method not implemented.');
    }
}