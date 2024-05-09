import { injectable } from "inversify"

@injectable()
export class TestAxiosMock {
    async get(): Promise<any> {
        throw new Error('unexpected method call')
    }
    async post(): Promise<any>{
        throw new Error('unexpected method call')
    }
    async head(): Promise<any>{
        throw new Error('unexpected method call')
    }
}