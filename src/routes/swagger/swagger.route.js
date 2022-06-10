const express = require('express');
const swaggerDefinition = require('../../swagger-docs/swagger');
const router = express.Router();
const swaggerJsdoc = require('swagger-jsdoc');
const { serve, setup } = require('swagger-ui-express');

const swaggerSpec = swaggerJsdoc({
    swaggerDefinition,
    apis: ['src/swagger-docs/*.yml', 'src/routes/**/*.js'],
});

router.use('/', serve);
router.get(
    '/',
    setup(swaggerSpec, {
        explorer: true,
        swaggerOptions: {
            filter: true,
            displayRequestDuration: true,
        }
    })
);

module.exports = router;