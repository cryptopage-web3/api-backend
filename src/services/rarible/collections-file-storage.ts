import { readdirSync } from "fs";
import { resolve } from "path";
import { createDirIfNotExists, DATA_DIR, dumpToJson, getJson } from "../../util/data-util";
import { Blockchains, OptsCollectionPath } from "./types";

export const DATA_ROOT_DIR_NAME = 'collections';
const CONTINUATION_FILE_NAME = 'last_continue'

export function saveCollectionToFile(blockchain,fileName:string,collections){
    const path = buildCollectionPath({rootDirName:DATA_ROOT_DIR_NAME, blockchain, fileName});
    
    dumpToJson(path, collections)
}

export function getCollectionFromFile(blockchain, fileName){
    const path = buildCollectionPath({rootDirName: DATA_ROOT_DIR_NAME, blockchain, fileName})

    return getJson(path)
}

export function saveCollectionsContinue(blockchain, continuation, readCounter){
    const path = buildContinuePath(blockchain)

    dumpToJson(path, {continuation, readCounter})
}

export function getCollectionsIterator(blockchain:Blockchains){
    const collectionsPath = resolve(DATA_DIR, DATA_ROOT_DIR_NAME, blockchain),
        files = readdirSync(collectionsPath,{withFileTypes: false})

    console.log('files found ', files.length, 'in', collectionsPath)

    function getFileName(){
        while(files.length > 0){
            const f = files.shift() as string

            if(f.indexOf('.json') === -1){
                return getFileName()
            }

            return f
        }
    }

    function* generator() {
        let f 

        while(f = getFileName()){
            yield getCollectionFromFile(blockchain, f)
        }
    }

    return generator()
}

export function getCollectionsContinue(blockchain):{readCounter:number,continuation:string}{
    const path = buildContinuePath(blockchain)

    return getJson(path) || {};
}

export function initCollectionsDir(blockchain:Blockchains){
    const path = buildCollectionPath({
        rootDirName:DATA_ROOT_DIR_NAME,
        blockchain,
    })

    createDirIfNotExists(path)
}

export function buildCollectionPath(opts:OptsCollectionPath){
    const params:string[] = [
        DATA_DIR,
        ...(opts.rootDirName ? [opts.rootDirName] : []),
        opts.blockchain,
        ...( 'fileName' in opts ? [opts.fileName + (opts.fileName.indexOf('.json') == -1 ? '.json' : '')] : [])
    ];

    return resolve(...params)
}

function buildContinuePath(blockchain:Blockchains){
    const params:string[] = [
        DATA_DIR,
        DATA_ROOT_DIR_NAME,
        blockchain + '_' + CONTINUATION_FILE_NAME + '.json'
    ];

    return resolve(...params)
}