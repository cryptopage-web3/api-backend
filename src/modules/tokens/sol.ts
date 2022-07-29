import { ITokenManager } from './types';
import { CovalentApi } from '../../services/covalent/covalent-api';
import { inject, injectable } from 'inversify';
import { IDS } from '../../types/index';

@injectable()
export class CovalentTokenManager implements ITokenManager {
    @inject(IDS.SERVICE.CovalentApi) _covalentApi:CovalentApi

    getWalletTokens(address: string) {
        return this._covalentApi.getWalletTokens(address)
    }
}