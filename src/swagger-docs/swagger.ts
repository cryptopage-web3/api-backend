const { readFileSync } = require("fs");
const { resolve } = require("path");

/** readFileSync for avoid create package.json inside dist directory */
const packagePath = resolve(__dirname, '../../package.json')
const rawPackage = readFileSync(packagePath,'utf-8');
const { version } = JSON.parse(rawPackage); 

export const swaggerDefinition = {
    openapi: '3.0.1',
    info: {
        title: 'Crypto Page Documentation',
        version,
        license: {
            name: 'MIT',
        },
    },
    servers: [
        {
            url: 'https://api-m.crypto.page/',
            description: 'Prod server'
        },
        {
            url: 'https://stage-api.crypto.page/',
            description: 'Staging server'
        }
        
    ],
};

const localServer = {
    url: `http://127.0.0.1:${process.env.LOCAL_SERVER_PORT || 3000}/`,
    description: 'Local server'
}

if(process.env.SWAGGER_LOCAL_SERVER_FIRST){
    swaggerDefinition.servers.unshift(localServer)
} else {
    swaggerDefinition.servers.push(localServer)
}