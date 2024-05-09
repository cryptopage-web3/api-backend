export function isEqAddr(addr1: string, addr2: string){
    return new RegExp(`^${addr1}$`,'i').test(addr2)
}