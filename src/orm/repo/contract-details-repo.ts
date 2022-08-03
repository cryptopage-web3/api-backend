import { injectable } from 'inversify';
import { ChainId } from '../../modules/transactions/types';
import { ContractDetails } from '../model/contract-detail';

@injectable()
export class ContractDetailsRepo {
    async getContractName(chain:ChainId, contract:string){
        const c = await ContractDetails.findOne({where:{contractAddress: contract, chain}})

        return c?.name || contract
    }
}