// @ts-nocheck
const express = require('express');
const router = express.Router();
const transactionsModule = require('./../modules/transactions');

const BAD_REQUEST = 400;

/**
 * @swagger
 * /transactions/{chain}/{address}:
 *   get:
 *     summary: Get transactions from address.
 *     description: Get transactions from address.
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: chain
 *         required: true
 *         schema:
 *           type: string
 *           enum: [eth, bsc, matic, sol, tron]
 *           default: eth
 *         description: chain name
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: skip
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Transactions'
 *       "400":
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:chain/:address', async (req, res) => {

    const { chain, address } = req.params;
    const { skip = 0, limit = 20 } = req.query;

    try {
        const { transactions, count } = await transactionsModule.getWalletAllTransactions(address, chain, Number(skip), Number(limit));
        res.json({ transactions, count });
    } catch (err) {
        res.status(BAD_REQUEST).json({
            message: err.message
        });
    }
});

/**
 * @swagger
 * /transactions/transfers/{chain}/{address}:
 *   get:
 *     summary: Get transactions from address.
 *     description: Get transactions from address.
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: chain
 *         required: true
 *         schema:
 *           type: string
 *           enum: [eth, bsc, matic, sol, tron]
 *           default: eth
 *         description: chain name
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: skip
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Transactions'
 *       "400":
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/transfers/:chain/:address', async (req, res) => {

    const { chain, address } = req.params;
    const { skip = 0, limit = 20 } = req.query;

    try {
        const { transactions, count } = await transactionsModule.getWalletTokenTransfers(address, chain, Number(skip), Number(limit));
        res.json({ transactions, count });
    } catch (err) {
        res.status(BAD_REQUEST).json({
            message: err.message
        });
    }
});

module.exports = router;