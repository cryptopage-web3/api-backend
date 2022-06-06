const { readFileSync } = require("fs");

/** readFileSync for avoid create package.json inside dist directory */
const rawPackage = readFileSync('../../package.json','utf-8');
const { version } = JSON.parse(rawCred); 

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
            url: `https://crypto-page-app.herokuapp.com/`,
            description: 'Heroku server'
        },
        {
            url: `http://localhost:3000/`,
            description: 'Local server'
        }
    ],
};

module.exports = swaggerDef;
