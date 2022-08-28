import { injectable } from 'inversify';
import { ChainId } from '../../modules/transactions/types';
import { ContractDetails, ContractDetailsInferAttr } from '../model/contract-detail';

@injectable()
export class ContractDetailsRepo {
    async getContractName(chain:ChainId, contract:string){
        const c = await ContractDetails.findOne({where:{contractAddress: contract, chain}})

        return c?.name || contract
    }

    getContract(chain:ChainId, contractAddress:string){
        return ContractDetails.findOne({where:{contractAddress, chain}})
    }

    createContract(contract:ContractDetailsInferAttr){
        return ContractDetails.create(contract)
    }
}