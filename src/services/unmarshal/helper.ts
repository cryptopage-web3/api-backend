import { inject, injectable } from "inversify";
import { IDS } from '../../types/index';
import { Axios } from 'axios';

const InputDataDecoder = require('ethereum-input-data-decoder');
import Web3 from 'web3';
import * as abi from './erc20.json';

const typeList = ['image', 'audio', 'video'];
const types = { '.jpg': 'image', '.png': 'image', '.gif': 'image', '.jpeg': 'image', '.webp': 'image', '.mp4': 'video', '.mp3': 'audio' };

@injectable()
export class UnmarshalApiHelper {
    @inject(IDS.NODE_MODULES.axios) _axios: Axios

    normalizeUrl(url) {
        if (!url) return;
        if (url.startsWith('ipfs://ipfs/')) {
            return url.replace('ipfs://', 'https://ipfs.io/')
        } else if (url.startsWith('ipfs://')) {
            return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
        } else {
            return url;
        }
    }
    
    async getType(link) {
        if (!link) return;
    
        for (let extension in types) {
            if (link.endsWith(extension)) {
                return types[extension];
            }
        }
    
        let type;
        try {
            if (link.startsWith('https://') || link.startsWith('http://')) {
                const result = await this._axios.head(link);
                const contentType = result.headers['content-type'].split('/')[0];
                type = contentType;
                if (typeList.includes(type)) {
                    return type;
                }
            }
        } catch (e) { }
    }
    
    async getDataFromUrl(link) {
        const url = this.normalizeUrl(link);
        const type = await this.getType(url);
        return { url, type }
    }
    
    async getContractName(blockchain, address) {
        const urls = {
            ethereum: 'https://api.etherscan.io',
            binance: 'https://api.bscscan.com',
            polygon: 'https://api.polygonscan.com',
        }
        const keys = {
            ethereum: 'VQDBC4GZA5MQT2F6IRW2U6RPH66HJRSF6S',
            polygon: 'TQDPK4XAU4BZT8WQNN6IETRRXXDI37W64Y',
            binance: '4DCKF5U2YGR1HNG1KHWP8DSK47AH85W28Z'
        }
        try {
            const { data } = await this._axios.get(`${urls[blockchain]}/api?module=contract&action=getsourcecode&address=${address}&apikey=${keys[blockchain]}`);
            return data.result[0].ContractName;
        } catch (e) {
            return address;
        }
    }
    
     async getApproveTarget(blockchain, txHash) {
        const rpc = {
            ethereum: 'https://eth.public-rpc.com',
            binance: 'https://bscrpc.com',
            polygon: 'https://polygon-rpc.com',
        }
        try {
            const web3 = new Web3(rpc[blockchain]);
            const transaction = await web3.eth.getTransaction(txHash);
            const address = this.decodeEthDataAndGetApproveTarget(transaction.input);
            return address;
        } catch (e) {
            return '';
        }
    }
    
    decodeEthDataAndGetApproveTarget(data) {
        const decoder = new InputDataDecoder(abi);
        const result = decoder.decodeData(data) || {};
        return result.inputs[0];
    }
}