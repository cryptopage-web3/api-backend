import { injectable } from 'inversify';

@injectable()
export class TestErrorLogRepoMock {
    _isEnabled: boolean = true

    enable(){
        this._isEnabled = true
    }

    disable(){
        this._isEnabled = false
    }
    async log(...args:any[]){
        if(this._isEnabled){
            console.error(...args)
        }
    }
}