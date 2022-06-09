namespace DataUtil {
    export type dirPathOpts = {
        rootDirName?:string
        blockchain:string
    }

    export type filePathOpts = dirPathOpts & {
        fileName:string
    }

    export type pathOpts = dirPathOpts | filePathOpts
}