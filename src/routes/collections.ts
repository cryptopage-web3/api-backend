import { Router } from "express";
import { FindOptions, InferAttributes } from "sequelize/types";
import { NftCollection } from "../orm/model/nftcollection";

export const collectionsRouter = Router();

/**
 * @swagger
 * /collections:
 *   get:
 *     description: Get nft collections
 *     tags: [Collections]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *           default: 0
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/NftCollections'
 */
collectionsRouter.get('/',async (req,res)=>{
    const where: FindOptions<InferAttributes<NftCollection, {omit: never;}>> = {
            where: {isEnabled: true},
            limit: parseInt(req.query.limit as string) || 10,
            offset: parseInt(req.query.offset as string) || 0
        },
        data = await NftCollection.findAll(where),
        itemsTotal = await NftCollection.count(where)

    res.json({data, itemsTotal})
})