const express = require('express');
const router = express.Router();

//const tokensModule = require('./../modules/tokens');
const BAD_REQUEST = 400;

/**
 * @swagger
 * /tokens/{chain}/{address}:
 *   get:
 *     summary: Get tokens from address.
 *     description: Get tokens from address.
 *     tags: [Tokens]
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
 *         description: wallet address
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
 *                 $ref: '#/components/schemas/Tokens'
 *       "400":
 *         $ref: '#/components/responses/NotFound'
 */
 router.get('/:chain/:address', async (req, res) => {

    const { chain, address } = req.params;
    const { skip = 0, limit = 20 } = req.query;

    try {
        const result = await tokensModule.getWalletTokens(address, chain, Number(skip), Number(limit));
        res.json(result);
    } catch (err) {
        res.status(BAD_REQUEST).json({
            message: err.message
        });
    }
});

module.exports = router;