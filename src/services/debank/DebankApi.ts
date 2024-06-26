import { inject, injectable } from "inversify";
import { IDS } from "../../types";
import { Axios } from "axios";
import { toUrlQueryParams } from "../../util/url-util";
import { IUserToken } from "./types";

const baseUrl = 'https://pro-openapi.debank.com'

@injectable()
export class DebankApi {
    @inject(IDS.NODE_MODULES.axios) _axios: Axios
    @inject(IDS.CONFIG.DebankApiKey) _apiKey: string

    async getWalletTokensInAllChains(address:string):Promise<IUserToken[]>{
        const tokens:IUserToken[] = await this.apiGet('v1/user/all_token_list', {id: address, is_all: false})

        return tokens.filter(t => t.is_verified)
    }

    async apiGet(path:string, params:any = null){
        const queryStr = params ? '?' + toUrlQueryParams(params) : '',
            url = `${baseUrl}/${path}${queryStr}`

        const response = await this._axios.get(url,{
            headers:{
                accept: 'application/json',
                AccessKey: this._apiKey
            }
        })

        return response.data
    }
}