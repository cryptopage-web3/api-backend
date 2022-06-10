// @ts-nocheck
const express = require('express');
const router = express.Router();

const appleSiteJson = require('../enums/appleSite');
const { collectionsRouter } = require('./collections');

const BAD_REQUEST = 400;

router.get('/health-check', async (_, res) => {

    try {
        res.json({ success: true });
    } catch (err) {
        res.status(BAD_REQUEST).json({
            message: err.message
        });
    }
});

router.get('/login*', async (_, res) => {

    try {
        res.json(appleSiteJson);
    } catch (err) {
        res.status(BAD_REQUEST).json({
            message: err.message
        });
    }
});

router.get('/apple-app-site-association', async (_, res) => {

    try {
        res.json(appleSiteJson);
    } catch (err) {
        res.status(BAD_REQUEST).json({
            message: err.message
        });
    }
});

router.use('/collections', collectionsRouter)

module.exports = router;
