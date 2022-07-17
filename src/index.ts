require('dotenv').config();

import 'reflect-metadata'

import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from './ioc'
import { envToInt, envToString } from './util/env-util';

const express = require('express');
const app = express();
const cors = require('cors')
const port = envToInt('PORT', 3000);
const host = envToString('HOST','');
app.use(cors());

app.use(express.static('public'))

require('./cache/coins');

app.use(express.json({ limit: '15mb' }));

app.use('/', require('./routes'));
app.use('/tokens', require('./routes/tokens'));
app.use('/nfts', require('./routes/nfts'));

const swaggerRoutes = require('./routes/swagger/swagger.route');
app.use('/', swaggerRoutes);

let server = new InversifyExpressServer(container, null, null, app);

server.build().listen(port, host, function () {
    console.log(`app listening to ${host? host+':': ''} ${port}`);
})
