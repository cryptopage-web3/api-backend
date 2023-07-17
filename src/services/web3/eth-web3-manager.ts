import { inject, injectable } from 'inversify';
import { IWeb3Manager } from './types';
import { IDS } from '../../types/index';
import Web3 from 'web3';
import { Web3NftTokenData } from '../../modules/nfts/types';
import { ErrorLogRepo } from '../../orm/repo/error-log-repo';
import { ChainId } from '../../modules/transactions/types';
import { BlockDetailsRepo } from '../../orm/repo/block-details-repo';
import { Web3Util } from './web3-util';
import { AssetTransfersCategory } from 'alchemy-sdk';
import { ICommunity, ISocialComment } from './social-smart-contract/types';

@injectable()
export class EthWeb3Manager implements IWeb3Manager {
    @inject(IDS.NODE_MODULES.web3) _web3: Web3
    @inject(IDS.SERVICE.WEB3.ContractFactory) _ethContractFactory: Function
    @inject(IDS.ORM.REPO.ErrorLogRepo) _errorLogRepo: ErrorLogRepo
    @inject(IDS.ORM.REPO.BlockDetailsRepo) _blockDetailsRepo: BlockDetailsRepo
    @inject(IDS.SERVICE.WEB3.Web3Util) _web3Util: Web3Util
    @inject(IDS.SERVICE.CryptoPageCommunity) _community: ICommunity

    _chainId:ChainId

    setChainId(chainId: ChainId) {
        this._chainId = chainId
    }

    async getDateFromBlock(blockNum: number): Promise<Date> {
        const cached = await this._blockDetailsRepo.getDetails(this._chainId, blockNum)

        if(cached){
            return cached.blockDate
        }

        const web3BlockDate = await this._getWeb3BlockDate(blockNum)

        this._blockDetailsRepo.saveDetails(
            this._chainId, blockNum, web3BlockDate
        ).catch(err => console.error('Failed to save block details', err))

        return web3BlockDate
    }

    async _getWeb3BlockDate(blockNum: number){
        const block = await this._web3.eth.getBlock(blockNum);
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

    async getTokenData(contrctAddress: string, tokenId: string, tokenCategory:AssetTransfersCategory = AssetTransfersCategory.ERC721):Promise<Web3NftTokenData> {
        const meta = await this.getTokenMetadata(contrctAddress, tokenId, tokenCategory)

        return Object.assign({}, meta,{price: '0'})
    }

    async getTokenMetadata(contrctAddress: string, tokenId: string, category: AssetTransfersCategory){
        const methodName = category == AssetTransfersCategory.ERC1155 ? 'uri' : 'tokenURI';

        const minABI:any[] = [
            { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": methodName, "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }
        ];
        const contract = this._ethContractFactory(minABI, contrctAddress);

        const method  = category == AssetTransfersCategory.ERC1155 
            ? contract.methods.uri(tokenId) 
            : contract.methods.tokenURI(tokenId) 

        const metadataUri = await method.call().catch(err =>{
            this._errorLogRepo.log('web3_contract_call_get_token_uri', err.message, {contrctAddress, tokenId})
			if(process.env.PREVENT_LOG_ERRORS !== 'yes'){
                console.error(`Failed to get tokenURI, contract: ${contrctAddress}, tokenId: ${tokenId}`, err.message)
			}
            
            return Promise.reject(err)
        });
        
        
        return this._web3Util.loadTokenMetadata(metadataUri, tokenId)
    }

    getComments(contrctAddress: string, tokenId: string): Promise<ISocialComment[]> {
        return this._community.getComments(contrctAddress, tokenId)
    }
}