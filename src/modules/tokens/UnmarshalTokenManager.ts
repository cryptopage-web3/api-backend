import { ITokenManager } from './types';
import { UnmarshalApi } from '../../services/unmarshal/UnmarhalApi';
import { inject, injectable } from 'inversify';
import { IDS } from '../../types/index';

@injectable()
export class UnmarshalTokenManager implements ITokenManager {
    _unmarshalApi:UnmarshalApi
    constructor(@inject(IDS.SERVICE.UnmarshalApiFactory) _unmarshalApiFactory: () => UnmarshalApi){
        this._unmarshalApi = _unmarshalApiFactory()
    }

    getWalletTokens(address: string) {
        return this._unmarshalApi.getWalletTokens(address)
    }
}