import { ITokenManager } from './types';
import { UnmarshalApi } from '../../services/unmarshal/UnmarhalApi';
import { inject, injectable } from 'inversify';
import { IDS } from '../../types/index';

@injectable()
export class UnmarshalTokenManager implements ITokenManager {
    _unmarshalApi:UnmarshalApi
    constructor(@inject(IDS.SERVICE.UnmarshalApi) unmarshalApi: UnmarshalApi){
        this._unmarshalApi = unmarshalApi
    }

    getWalletTokens(address: string) {
        return this._unmarshalApi.getWalletTokens(address)
    }
}