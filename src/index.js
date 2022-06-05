const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const cors = require('cors')
const port = process.env.PORT || 3000;
app.use(cors());

require('./cache/coins');

app.use(express.json({ limit: '15mb' }));

app.use('/', require('./routes'));
app.use('/tokens', require('./routes/tokens'));
app.use('/transactions', require('./routes/transactions'));

const swaggerRoutes = require('./routes/swagger/swagger.route');
app.use('/', swaggerRoutes);

httpServer.listen(port, function () {
    console.log(`app listening to ${port}`);
});
