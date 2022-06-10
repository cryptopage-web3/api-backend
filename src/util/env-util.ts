import { EnvVarName } from "../environment";

const stringYes: string[] = ['yes', '1','true','on'];

export function envToBool(envName:EnvVarName, defaultValue?:boolean): boolean {
    const value = getRawValue(envName, defaultValue);

    if(!value)
        return defaultValue as boolean;

    return stringYes.indexOf(value.toLowerCase()) > -1;
}

export function envToNumber(envName:EnvVarName, defaultValue?:number):number{   
    const value = getRawValue(envName, defaultValue);

    if(!value){
        return defaultValue as number;
    }

    return parseFloat(value);
}

export function envToInt(envName:EnvVarName, defaultValue?):number{
    const value = getRawValue(envName, defaultValue);

    if(!value)
        return defaultValue || 0;
        
    return parseInt(value);
}

export function envToArray(envName:EnvVarName, defaultValue?):string[]{
    const value = getRawValue(envName, defaultValue);

    if(!value)
        return defaultValue;

    const result: string[] = [];

    value.split(',').forEach((item)=>{
        const trimedValue = item.trim();

        if(trimedValue.length > 0)
            result.push(trimedValue);
    });

    return result;
}

export function envToString(envName:EnvVarName, defaultValue?: string):string {
    const value = getRawValue(envName, defaultValue);

    if(!value)
        return defaultValue as string

    return value
}

export function isProd(){
    return process.env.NODE_ENV === 'production';
}

function getRawValue(envName:EnvVarName, defaultValue) {
    if( defaultValue === undefined && process.env[envName] === undefined){
        throw new Error(`Environment variable ${envName} is required`);
    }

    return process.env[envName];
}