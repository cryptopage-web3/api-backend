import { swaggerDefinition } from './swagger';
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const { serve, setup } = require('swagger-ui-express');

export const swaggerRouter = express.Router();

const swaggerSpec = swaggerJsdoc({
    swaggerDefinition,
    apis: ['src/swagger-docs/**/*.yml', 'src/routes/**/*.js','src/routes/**/*.ts','src/controller/**/*.ts'],
});

swaggerRouter.use('/', serve);
swaggerRouter.get(
    '/',
    setup(swaggerSpec, {
        explorer: true,
        swaggerOptions: {
            filter: true,
            displayRequestDuration: true,
        }
    })
);
