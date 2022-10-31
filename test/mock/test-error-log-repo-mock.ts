import { injectable } from 'inversify';

@injectable()
export class TestErrorLogRepoMock {
    async log(err:string){}
}