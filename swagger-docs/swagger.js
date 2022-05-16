const { version } = require('../package.json');

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
            description: 'Heroku Server'
        },
        {
            url: `http://localhost:3000/`,
            description: 'Local server'
        }
    ],
};

module.exports = swaggerDef;
