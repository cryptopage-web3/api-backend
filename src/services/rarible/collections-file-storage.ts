import { readdirSync } from "fs";
import { resolve } from "path";
import { createDirIfNotExists, DATA_DIR, dumpToJson, getJson } from "../../util/data-util";
import { getContinue, saveContinue } from "./api-util";
import { Blockchains } from "./types";

export const DATA_ROOT_DIR_NAME = 'collections';

export function saveCollectionToFile(blockchain,fileName:string,collections){
    dumpToJson({
        rootDirName:DATA_ROOT_DIR_NAME,
        blockchain,
        fileName
    }, collections)
}

export function getCollectionFromFile(blockchain, fileName){
    return getJson({rootDirName: DATA_ROOT_DIR_NAME, blockchain, fileName})
}

export function saveCollectionsContinue(blockchain, continuation, readCounter){
    saveContinue(DATA_ROOT_DIR_NAME, blockchain, continuation, readCounter)
}

export function getCollectionsIterator(blockchain:Blockchains){
    const collectionsPath = resolve(DATA_DIR, DATA_ROOT_DIR_NAME),
        files = readdirSync(collectionsPath,{withFileTypes: false})

    console.log('files found ', files.length, 'in', collectionsPath)

    return (function* getNext() {
        const f = files.shift() as string

        if(!f){
            return
        }

        if(f.indexOf('.json') === -1){
            return getNext();
        }

        yield getCollectionFromFile(blockchain, f);
    })()
}

export function getCollectionsContinue(blockchain){
    return getContinue(DATA_ROOT_DIR_NAME, blockchain)
}

export function initCollectionsDir(blockchain:Blockchains){
    createDirIfNotExists({
        rootDirName:DATA_ROOT_DIR_NAME,
        blockchain,
    })
}