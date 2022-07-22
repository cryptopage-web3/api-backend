import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export const DATA_DIR = resolve(__dirname, '../../data');

export function getJson(path: string){
    if(existsSync(path)){
        //console.log('Load', path)

        const data = readFileSync(path, 'utf-8');

        return JSON.parse(data)
    }

    console.log('Not exists', path)

    return null;
}

export function dumpToJson(path: string, data){
    writeFileSync(path,JSON.stringify(data))

    console.log(path, 'saved')
}

export function createDirIfNotExists(path:string){
    if(!existsSync(path)){
        mkdirSync(path, {recursive: true})
    }
}

export function buildAbsoluteDataPath(path: string){
    return resolve(DATA_DIR, path);
}