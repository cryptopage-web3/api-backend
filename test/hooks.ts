import Sinon from 'sinon';

export const mochaHooks = {
    beforeEach(){
        process.env.PREVENT_LOG_ERRORS = 'yes'
    },
    afterEach(){
        Sinon.resetBehavior()
        Sinon.resetHistory()
    }
}