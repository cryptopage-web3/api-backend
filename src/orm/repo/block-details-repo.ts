import { injectable } from 'inversify';
import { ChainId } from '../../modules/transactions/types';
import { BlockDetails } from '../model/block-details';

@injectable()
export class BlockDetailsRepo {
    getDetails(chain:ChainId, blockNumber: number){
        return BlockDetails.findOne({where:{ chain, blockNumber}})
    }

    async saveDetails(chain:ChainId, blockNumber: number, blockDate: Date){
        const exists = await this.getDetails(chain, blockNumber)

        if(exists){
            return
        }

        await BlockDetails.create({chain, blockNumber, blockDate})
    }
}