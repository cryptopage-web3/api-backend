export function toUrlQueryParams(params:object){
    return Object.keys(params)
        .filter(key => params[key])
        .map(key => `${key}=${params[key]}`).join('&');
}