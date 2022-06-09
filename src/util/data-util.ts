import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export const DATA_DIR = resolve(__dirname, '../../data');

export function getJson(pathOpts:DataUtil.filePathOpts){
    const path = buildPath(pathOpts);

    if(existsSync(path)){
        console.log('Load', path)

        const data = readFileSync(path, 'utf-8');

        return JSON.parse(data)
    }

    console.log('Not exists', path)

    return null;
}

export function dumpToJson(opts: DataUtil.filePathOpts, data){
    const path = buildPath(opts);

    writeFileSync(path,JSON.stringify(data))

    console.log(path, 'saved')
}

export function buildPath(opts:DataUtil.pathOpts){
    const params:string[] = [
        DATA_DIR,
        ...(opts.rootDirName ? [opts.rootDirName] : []),
        opts.blockchain,
        ...( 'fileName' in opts ? [opts.fileName + (opts.fileName.indexOf('.json') == -1 ? '.json' : '')] : [])
    ];

    return resolve(...params)
}

export function createDirIfNotExists(opts:DataUtil.pathOpts){
    const path = buildPath(opts);

    if(!existsSync(path)){
        mkdirSync(path, {recursive: true})
    }
}