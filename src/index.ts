import { initEnvVariables } from './env-init';

initEnvVariables()

import 'reflect-metadata'

import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from './ioc'
import { envToInt, envToString } from './util/env-util';
import { swaggerRouter } from './swagger-docs/swagger.route';
import { IDS } from './types/index';
import { PriceCache } from './cache/coins';

const express = require('express');
const app = express();
const cors = require('cors')
const port = envToInt('PORT', 3000);
const host = envToString('HOST','');
app.use(cors());

app.use(express.static('public'))

app.use(express.json({ limit: '15mb' }));

app.use('/', swaggerRouter);

let server = new InversifyExpressServer(container, null, null, app);

server.build().listen(port, host, function () {
    console.log(`app listening to ${host? host+':': ''} ${port}`);

    container.get<PriceCache>(IDS.CACHE.PriceCache).updateCoinsCache()
})
