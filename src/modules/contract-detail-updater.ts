require('dotenv').config()
import { getJson, buildAbsoluteDataPath } from '../util/data-util';
import { safeStart } from '../util/safe-start';
import { ChainId } from './transactions/types';
import { ContractDetails } from '../orm/model/contract-detail';
import { DefiLamaContract } from './types';
import { InferAttributes } from 'sequelize';


const chainsMap = {
    Ethereum:ChainId.eth,
    Solana: ChainId.sol,
    Polygon: ChainId.matic,
    Tron: ChainId.tron,
    Binance: ChainId.bsc
};

async function run(){
    const protocolsData: DefiLamaContract[] = getContractsDetails()
    const contracts = normalizeData(protocolsData);

    for(let c of contracts){
        const dbContract = await ContractDetails.findOne({where: { chain: c.chain, name: c.name}})

        if(!dbContract){
            await ContractDetails.create(c)
        }
    }
}

/** JSON from https://api.llama.fi/protocols */
function getContractsDetails(){
    return getJson(buildAbsoluteDataPath('protocols.json'));
}

function normalizeData(protocolsData: DefiLamaContract[]): InferAttributes<ContractDetails>[]{
    const contracts: InferAttributes<ContractDetails>[] = [];

    protocolsData.forEach(contract => {
        contract.chains.forEach(chain => {
            const chainId = chainsMap[chain]
            if(!chainId || !contract.address || contract.address == '-'){
                return
            }

            contracts.push({
                contractAddress: contract.address,
                name: contract.name,
                symbol: contract.symbol,
                description: contract.description,
                url: contract.url,
                chain: chainId
            })
        })
    })

    return contracts
}

safeStart(run)