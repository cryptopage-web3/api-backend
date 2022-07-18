const { readFileSync } = require("fs");
const { resolve } = require("path");

/** readFileSync for avoid create package.json inside dist directory */
const packagePath = resolve(__dirname, '../../package.json')
const rawPackage = readFileSync(packagePath,'utf-8');
const { version } = JSON.parse(rawPackage); 

const swaggerDef = {
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
            description: 'Dev server'
        },
        {
            url: `https://crypto-page-app.herokuapp.com/`,
            description: 'Heroku server'
        },
        {
            url: `http://localhost:${process.env.LOCAL_SERVER_PORT || 3000}/`,
            description: 'Local server'
        }
    ],
};

module.exports = swaggerDef;
