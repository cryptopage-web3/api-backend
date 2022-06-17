import { Router } from "express";
import { FindOptions, InferAttributes } from "sequelize/types";
import { NftCollection } from "../orm/model/nftcollection";
import { NftItem } from "../orm/model/nftitem";

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

/**
 * @swagger
 * /collections/{id}:
 *  get:
 *      description: Get collection items
 *      tags: [NftItems]
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
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
 *      responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/NftItems'
 */
collectionsRouter.get('/:id', async(req, res)=>{
    const findOpts: FindOptions<InferAttributes<NftItem, {omit: never;}>> = {
            attributes:['id','itemId','metaName','metaDescr'],
            include: {
                association: NftItem.associations.meta, 
                attributes:['url','type','representation','mimeType']
            },
            where:{    
                collectionId: parseInt(req.params.id)
            },
            limit: parseInt(req.query.limit as string) || 10,
            offset: parseInt(req.query.offset as string) || 0,
        },
        data = await NftItem.findAll(findOpts),
        itemsTotal = await NftItem.count({where: findOpts.where})

    res.json({data, itemsTotal})
})