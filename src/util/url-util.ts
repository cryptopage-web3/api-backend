export function toUrlQueryParams(params:object){
    return Object.keys(params)
        .filter(key => params[key])
        .map(key => `${key}=${params[key]}`).join('&');
}

export function normalizeUrl(url:string) {
    if (!url) return '';
    if (url.startsWith('ipfs://ipfs/')) {
        return url.replace('ipfs://', 'https://ipfs.io/')
    } else if (url.startsWith('ipfs://')) {
        return url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    } else if(url.indexOf('ipfs/ipfs/') !== -1){
        const [,ipfsHash] = url.split('ipfs/ipfs/')
        return `https://ipfs.io/ipfs/${ipfsHash}`
    } else {
        return url;
    }
}