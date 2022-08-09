import { inject, injectable } from 'inversify';
import { toUrlQueryParams } from '../../util/url-util';
import { IDS } from '../../types/index';
import { Axios } from 'axios';

const API_URL = `https://api.etherscan.io/api`;

@injectable()
export class EtherscanApi {
    @inject(IDS.NODE_MODULES.axios) _axios: Axios
    @inject(IDS.CONFIG.EtherscanApiKey) private apiKey: string;

    private numberFields = ['blockNumber','timeStamp','nonce','tokenDecimal','transactionIndex','gas','gasPrice','gasUsed','cumulativeGasUsed','confirmations','value'];


    async getTxCount(address: string) {
        try {
            const { data } = await this._axios.get(`${API_URL}module=account&action=txlist&address=${address}&startblock=0&endblock=999999999999&sort=asc&apikey=${this.apiKey}`, {timeout: 10000});
            return data.result.length;
        } catch {
            return 0;
        }
    }

    async getTransactions(address: string, page: number, offset: number){
        return this.apiCall(
            {module: 'account', action: 'txlist', sort:'desc', address, page, offset}
        ).then(res => {
            return res.map(row => this.mapNumbers(row))
        });
    }

    async getErc20Trnsactions(address: string, page: number, offset: number){
        return this.apiCall(
            {module: 'account', action: 'tokentx', sort:'desc', address, page, offset}
        ).then(res => {
            return res.map(row => this.mapNumbers(row))
        });
    }

    mapNumbers(tx){
        this.numberFields.forEach(fld =>{
            if(!tx[fld]){
                return;
            }

            if(fld == 'value'){
                tx[fld] = parseInt(tx[fld]) / Math.pow(10, tx.tokenDecimal || 18)
            } else {
                tx[fld] = parseInt(tx[fld])
            }
        })

        return tx;
    }

    private async apiCall(params: Object){
        const url = this.buildUrl(params)

        const {data} = await this._axios.get(url);

        return data.result;
    }

    private buildUrl(params: Object){
        const queryParams = toUrlQueryParams(Object.assign({},params, {apikey: this.apiKey}))

        return `${API_URL}?${queryParams}`;
    }
}