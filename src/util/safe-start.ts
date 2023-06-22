export function safeStart(callback, opts?:ISafeStartOpts){
    async function _doSafeStart(){
        try {
            if(opts?.verb){
                console.log('safeStart run:', opts?.descr)
            }
            
            await callback()
        } catch (error) {
            console.error('safeStart', opts?.descr, error);
        }

        if(opts?.intervalInSeconds){
            if(opts?.verb){
                console.log('safeStart', opts.descr, `next start in ${opts.intervalInSeconds} sec`)
            }
            setTimeout(_doSafeStart, opts.intervalInSeconds * 1000);
        }
    }
    
    _doSafeStart();
}

export interface ISafeStartOpts {
    intervalInSeconds?:number
    descr?: string
    verb?: boolean
}