require('dotenv').config();

const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors')
const port = process.env.PORT || 3000;
const host = process.env.HOST
app.use(cors());

app.use(express.static('public'))

require('./cache/coins');

app.use(express.json({ limit: '15mb' }));

app.use('/', require('./routes'));
app.use('/tokens', require('./routes/tokens'));
app.use('/transactions', require('./routes/transactions'));
app.use('/nfts', require('./routes/nfts'));

const swaggerRoutes = require('./routes/swagger/swagger.route');
app.use('/', swaggerRoutes);

httpServer.listen(port, host, function () {
    console.log(`app listening to ${host? host+':': ''} ${port}`);
});
