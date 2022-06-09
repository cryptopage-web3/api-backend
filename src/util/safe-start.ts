export function safeStart(callback, intervalInSeconds?:number){
    async function _doSafeStart(){
        try {
            await callback()
        } catch (error) {
            console.error(error);
        }

        if(intervalInSeconds){
            console.log(`Next start in ${intervalInSeconds} sec`)
            setTimeout(_doSafeStart, intervalInSeconds * 1000);
        }
    }
    
    _doSafeStart();
}