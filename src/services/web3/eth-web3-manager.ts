import { inject, injectable } from 'inversify';
import { IWeb3Manager } from './types';
import { IDS } from '../../types/index';
import Web3 from 'web3';
import { Web3NftTokenData } from 'modules/nfts/types';
import { normalizeUrl } from '../../util/url-util';
import { Axios } from 'axios';
import { ErrorLogRepo } from '../../orm/repo/error-log-repo';

@injectable()
export class EthWeb3Manager implements IWeb3Manager {
    @inject(IDS.NODE_MODULES.web3) _web3: Web3
    @inject(IDS.NODE_MODULES.axios) _axios: Axios
    @inject(IDS.SERVICE.WEB3.EthContractFactory) _ethContractFactory: Function
    @inject(IDS.ORM.REPO.ErrorLogRepo) _errorLogRepo: ErrorLogRepo

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

        const contract = this._ethContractFactory(minABI, address);
        return contract.methods[key]().call();
    }

    async getTokenData(contrctAddress: string, tokenId: string):Promise<Web3NftTokenData> {
        const meta = await this.getTokenMetadata(contrctAddress, tokenId)

        return Object.assign({}, meta,{price: '0'})
    }

    async getTokenMetadata(contrctAddress: string, tokenId: string){
        const minABI:any[] = [
            { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
        ];
        const contract = this._ethContractFactory(minABI, contrctAddress);
        const metadataUri = await contract.methods.tokenURI(tokenId).call().catch(err =>{
            this._errorLogRepo.log('web3_contract_call_get_token_uri')
			if(!process.env.PREVENT_LOG_ERRORS){
                console.error(`Failed to get tokenURI, contract: ${contrctAddress}, tokenId: ${tokenId}`, err.message)
			}
            
            return Promise.reject(err)
        });
        const urlNormalized = normalizeUrl(metadataUri);
        if(urlNormalized){
            const { data } = await this._axios.get(urlNormalized).catch(err => {
                if(!process.env.PREVENT_LOG_ERRORS){
                    this._errorLogRepo.log('external_url_get_token_json', err.message, urlNormalized)
                    console.error(`Failed to getNft data tokenID: ${tokenId}`, metadataUri, urlNormalized, err.message)
                }
                
                return Promise.reject(err)
            });
            return {
                url: data.image || data.animation_url,
                type: data.image ? 'image' : '721',
                name: data.name,
                description: data.description,
                attributes: data.attributes || []
            }
        }
        
        return null
    }
}