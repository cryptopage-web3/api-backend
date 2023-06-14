import { TokenErcCategory, Web3NftTokenData } from '../../modules/nfts/types';
import { IChainContext } from '../../types/index';

export interface IWeb3Manager extends IChainContext {
    getDateFromBlock(blocknum: number): Promise<Date>
    getFieldFromContract(address: string, key: string)
    getTokenData(contrctAddress: string, tokenId: string, category?: TokenErcCategory):Promise<Web3NftTokenData>
}