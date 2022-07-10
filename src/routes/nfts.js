// @ts-nocheck
const express = require('express');
const router = express.Router();
const nftsModule = require('./../modules/nfts');

const BAD_REQUEST = 400;

/**
 * @swagger
 * /nfts/{chain}/{address}:
 *   get:
 *     summary: Get nfts from address.
 *     description: Get nfts from address.
 *     tags: [NFT]
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
 *                 $ref: '#/components/schemas/NFTs'
 *       "400":
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:chain/:address', async (req, res) => {

    const { chain, address } = req.params;
    const { skip = 1, limit = 20 } = req.query;

    try {
        const { list, count } = await nftsModule.getWalletAllNFTs(address, chain, Number(skip), Number(limit));
        res.json({ list, count });
    } catch (err) {
        res.status(BAD_REQUEST).json({
            message: err.message
        });
    }
});

/**
 * @swagger
 * /nfts/transactions/{chain}/{address}:
 *   get:
 *     summary: Get nft transactions from address.
 *     description: Get nft transactions from address.
 *     tags: [NFT]
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
 *                 $ref: '#/components/schemas/NFTTransactions'
 *       "400":
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/transactions/:chain/:address', async (req, res) => {

    const { chain, address } = req.params;
    const { skip = 0, limit = 20 } = req.query;

    try {
        const { list, count } = await nftsModule.getWalletNFTTransactions(address, chain, Number(skip), Number(limit));
        res.json({ list, count });
    } catch (err) {
        res.status(BAD_REQUEST).json({
            message: err.message
        });
    }
});

module.exports = router;