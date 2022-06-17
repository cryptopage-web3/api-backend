import { existsSync, readdirSync, rmSync } from "fs";
import { dirname, resolve } from "path";
import { createDirIfNotExists, DATA_DIR, dumpToJson, getJson } from "../../util/data-util";
import { Blockchains, NftItemContinue, OptsNftItemPath } from "./types";

export const NFT_ITEM_DIR_NAME = 'nft_item';
const CONTINUATION_NAME = 'last_continue'

export function getNftItemIterator(blockchain:Blockchains){
    const collectionsPath = resolve(DATA_DIR, NFT_ITEM_DIR_NAME, blockchain),
        dirs = readdirSync(collectionsPath,{withFileTypes: false}),
        files: Array<Array<string>> = []
        
    console.log('collections found ', dirs.length, 'in', collectionsPath)
    
    dirs.forEach(currentDir => {
        const dirFiles = readdirSync(`${collectionsPath}/${currentDir}`,{withFileTypes: false}) as string[]
        files.push(...dirFiles.map(f => [currentDir, f]))
    });

    console.log('total files found:', files.length)

    function* generator() {
        let next

        while(next = files.shift()){
            const [collection, f] = next,
                path = buildItemPath({
                    rootDirName: NFT_ITEM_DIR_NAME,
                    blockchain,
                    collectionId: collection,
                    fileName: f
                })

            yield {items: getNftItemFromFile(path), collection}
        }
    }

    return {generator: generator(), itemsTotal: files.length}
}

export function saveNftItemsToFile(blockchain:Blockchains,collectionId: string, fileName:string,collections){
    const path = buildItemPath({
        rootDirName:NFT_ITEM_DIR_NAME, blockchain, collectionId, fileName
    });
    
    dumpToJson(path, collections)
}

export function getNftItemFromFile(path:string){
    return getJson(path)
}

export function getNftItemContinue(blockchain): NftItemContinue{
    const path = buildContinuePath(blockchain)

    return getJson(path) || {};
}

export function saveNftItemsContinue(blockchain, params:NftItemContinue){
    const path = buildContinuePath(blockchain),
        data = getJson(path)


    dumpToJson(path, Object.assign({}, data, params))
}

export function initNftContinueDir(blockchain:Blockchains){
    const path = buildContinuePath(blockchain)

    createDirIfNotExists(dirname(path))
}

export function initNftItemsDir(blockchain:Blockchains, collectionId: number){
    const path = buildCollectionDirPath(blockchain, collectionId)

    createDirIfNotExists(path)
}

export function cleanupNftItemsDir(blockchain:Blockchains, collectionId: number){
    const path = buildCollectionDirPath(blockchain, collectionId)

    if(existsSync(path)){
        rmSync(path, {recursive:true, force: true})
    }

    initNftItemsDir(blockchain, collectionId)
}

function buildCollectionDirPath(blockchain:Blockchains, collectionId: number){
    return resolve(
        DATA_DIR,
        NFT_ITEM_DIR_NAME,
        blockchain,
        collectionId.toString()
    )
}

export function buildItemPath(opts:OptsNftItemPath){
    const params:string[] = [
        DATA_DIR,
        opts.rootDirName,
        opts.blockchain,
        ...(opts?.collectionId ? [opts.collectionId] : [] ),
        ...( 'fileName' in opts ? [opts.fileName + (opts.fileName.indexOf('.json') == -1 ? '.json' : '')] : [])
    ];

    return resolve(...params)
}

function buildContinuePath(blockchain:Blockchains){
    const params:string[] = [
        DATA_DIR,
        CONTINUATION_NAME,
        NFT_ITEM_DIR_NAME,
        blockchain + '.json'
    ];

    return resolve(...params)
}