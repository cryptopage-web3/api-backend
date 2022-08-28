import Sinon from 'sinon';

export const mochaHooks = {
    afterEach(){
        Sinon.resetBehavior()
        Sinon.resetHistory()
    }
}