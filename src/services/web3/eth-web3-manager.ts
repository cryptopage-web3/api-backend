import { inject, injectable } from 'inversify';
import { IWeb3Manager } from './types';
import { IDS } from '../../types/index';
import Web3 from 'web3';

@injectable()
export class EthWeb3Manager implements IWeb3Manager {
    _web3: Web3

    constructor(@inject(IDS.NODE_MODULES.web3) web3Factory:()=> Web3){
        this._web3 = web3Factory()
    }

    async getDateFromBlock(blocknum: number): Promise<Date> {
        const block = await this._web3.eth.getBlock(blocknum);
        const timestamp = typeof block.timestamp === 'number' 
            ? block.timestamp
            : parseInt(block.timestamp)

        return new Date(timestamp * 1000);
    }

    getFieldFromContract(address: string, key: string) {
        const minABI: any[] = [{
            "constant": true,
            "inputs": [],
            "name": key,
            "outputs": [{ "name": key, "type": "string" }],
            "type": "function"
        }];

        const contract = new this._web3.eth.Contract(minABI, address);
        return contract.methods[key]().call();
    }
}