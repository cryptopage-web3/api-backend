export const TestAxiosMock = {
    async get(): Promise<any> {
        console.log('call original axios get')
        throw new Error('unexpected method call')
    },
    async post(): Promise<any>{
        throw new Error('unexpected method call')
    },
    async head(): Promise<any>{
        throw new Error('unexpected method call')
    }
}