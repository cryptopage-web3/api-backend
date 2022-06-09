import { dumpToJson, getJson } from "../../util/data-util";

const CONTINUATION_FILE_NAME = 'last_continue'

export function getContinue(rootDirName, blockchain):{readCounter:number,continuation:string}{
    const pathOpts: DataUtil.filePathOpts = {
        rootDirName,
        blockchain,
        fileName: CONTINUATION_FILE_NAME
    }

    return getJson(pathOpts) || {};
}

export function saveContinue(rootDirName,blockchain, continuation, readCounter){
    const pathOpts: DataUtil.filePathOpts = {
        rootDirName,
        blockchain,
        fileName: CONTINUATION_FILE_NAME
    }

    let data = getJson(pathOpts) || {};

    data = {continuation, readCounter};

    dumpToJson(pathOpts, data)
}