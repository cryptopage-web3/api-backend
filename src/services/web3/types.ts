import { NftTokenData } from '../../modules/nfts/types';
export interface IWeb3Manager {
    getDateFromBlock(blocknum: number): Promise<Date>
    getFieldFromContract(address: string, key: string)
    getTokenData(contrctAddress: string, tokenId: string):Promise<NftTokenData>
}