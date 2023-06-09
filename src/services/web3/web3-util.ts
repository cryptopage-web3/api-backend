import { normalizeUrl } from '../../util/url-util';
import { inject, injectable } from 'inversify';
import { IDS } from '../../types/index';
import { Axios } from 'axios';
import { ErrorLogRepo } from '../../orm/repo/error-log-repo';

@injectable()
export class Web3Util {
    @inject(IDS.NODE_MODULES.axios) _axios: Axios
    @inject(IDS.ORM.REPO.ErrorLogRepo) _errorLogRepo: ErrorLogRepo

    async loadTokenMetadata(jsonUrl:string, tokenId?: string){
        const urlNormalized = normalizeUrl(jsonUrl);
        if(urlNormalized){
            const { data } = await this._axios.get(urlNormalized, {
                params: {
                    withoutWatermark: true
                }
            }).catch(err => {
                this._errorLogRepo.log('external_url_get_token_json', err.message, urlNormalized)

                if(!process.env.PREVENT_LOG_ERRORS){
                    console.error(`Failed to getNft data tokenID: ${tokenId}`, jsonUrl, urlNormalized, err.message)
                }
                
                return Promise.reject(err)
            });
            return {
                contentUrl: data.image || data.animation_url,
                //type: data.image ? 'image' : '721',
                name: data.name,
                description: data.description,
                attributes: data.attributes || []
            }
        }

        return null
    }
}