import { inject, injectable } from 'inversify';
import { IWeb3Manager } from './types';
import { IDS } from '../../types/index';
import Web3 from 'web3';
import { NftTokenData } from 'modules/nfts/types';
import { normalizeUrl } from '../../util/url-util';
import { Axios } from 'axios';

@injectable()
export class EthWeb3Manager implements IWeb3Manager {
    @inject(IDS.NODE_MODULES.web3) _web3: Web3
    @inject(IDS.NODE_MODULES.axios) _axios: Axios

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

    async getTokenData(contrctAddress: string, tokenId: string):Promise<NftTokenData> {
        const meta = await this.getTokenMetadata(contrctAddress, tokenId)

        return Object.assign({}, meta,{price: '0'})
    }

    async getTokenMetadata(contrctAddress: string, tokenId: string){
        const minABI:any[] = [
            { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
        ];
        const contract = new this._web3.eth.Contract(minABI, contrctAddress);
        const metadataUri = await contract.methods.tokenURI(tokenId).call();
        const urlNormalized = normalizeUrl(metadataUri);
        if(urlNormalized){
            const { data } = await this._axios.get(urlNormalized).catch(err => {
                console.log('Failed to getNft data', urlNormalized, err.message)
                return { data :{}}
            });
            return {
                url: data.image,
                type: data.image ? 'image' : '721',
                name: data.name,
                description: data.description,
                attributes: data.attributes || []
            }
        }
        
        return null
    }
}