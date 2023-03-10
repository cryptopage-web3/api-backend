import axios from 'axios'
import { toUrlQueryParams } from '../../util/url-util';
import { OptsGetAllCollections, OptsGetCollectionItems } from './types';


const BASE_API_URL = 'https://api.rarible.org/v0.1'

export function getAllCollections(opts: OptsGetAllCollections){
    const url = buildUrl('collections/all', opts);
    
    return axios.get(url).then(res => res.data);
}

export function getCollectionItems(opts: OptsGetCollectionItems){
    const url = buildUrl('items/byCollection', opts);
    
    return axios.get(url).then(res => res.data);
}

function buildUrl(segment, opts){
    return `${BASE_API_URL}/${segment}?${toUrlQueryParams(opts)}`
}