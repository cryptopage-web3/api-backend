export function safeStart(callback, opts?:ISafeStartOpts){
    async function _doSafeStart(){
        let result
        try {
            if(opts?.verb){
                console.log('safeStart run:', opts?.descr)
            }
            const params = opts?.params || []
            result = await callback(...params)
        } catch (error) {
            console.error('safeStart', opts?.descr, error);
        }

        if(opts?.intervalInSeconds){
            if(opts?.verb){
                console.log('safeStart', opts.descr, `next start in ${opts.intervalInSeconds} sec`)
            }
            setTimeout(_doSafeStart, opts.intervalInSeconds * 1000);
        } else {
            return !result ? Promise.resolve() : result
        }
    }
    
    return _doSafeStart();
}

export interface ISafeStartOpts {
    intervalInSeconds?:number
    descr?: string
    verb?: boolean
    params?: any[]
}