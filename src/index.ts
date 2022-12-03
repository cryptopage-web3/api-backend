import { initEnvVariables } from './env-init';

initEnvVariables()

import 'reflect-metadata'

import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from './ioc'
import { envToInt, envToString, isTest } from './util/env-util';
import { swaggerRouter } from './swagger-docs/swagger.route';
import { IDS } from './types/index';
import { PriceCache } from './cache/coins';
import rateLimit from 'express-rate-limit'
import express from 'express';
import cors from 'cors'

const app = express();
const port = envToInt('PORT', 3000);
const host = envToString('HOST','');

app.use(cors());

if(!isTest()){
    const rateLimitPerSecond = envToInt('API_RATE_LIMIT', 30)

    const limiter = rateLimit({
        windowMs: 1000, // 1 second
        max: rateLimitPerSecond, // Limit each IP to 10 requests per `window` (here, per 1 second)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
        message: {message: `Too Many Requests. Rate limit ${rateLimitPerSecond} per second`}
    })

    app.use(/^\/(nfts|tokens|transactions|collections)/, limiter)
}

app.use(express.static('public'))

app.use(express.json({ limit: '15mb' }));

app.use('/', swaggerRouter);

let server = new InversifyExpressServer(container, null, null, app);

server.build().listen(port, host, function () {
    console.log(`app listening to ${host? host+':': ''} ${port}`);

    container.get<PriceCache>(IDS.CACHE.PriceCache).updateCoinsCache()
})
