import { config } from "dotenv"
import { existsSync } from "fs"
import { resolve } from "path"

export function initEnvVariables(){
    config()

    const localEnvPath = resolve(process.cwd(),'.env.local')

    if(existsSync(localEnvPath)){
        config({path: localEnvPath, override: true})
    }
}