import { Request, Router } from "express";
import { FindOptions, InferAttributes, Op, WhereOptions } from "sequelize";
import { NftCollection, NftCollectionInferAttributes } from "../orm/model/nftcollection";
import { NftItem, NftItemCreationAttributes } from "../orm/model/nftitem";
import { asyncHandler } from "../util/router";
import { CollectionsQuery } from "./types";

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
 *       - in: query
 *         name: filter[name]
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter[blockchain]
 *         schema:
 *           type: string
 *           enum: [ETHEREUM,POLYGON]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/NftCollections'
 */
collectionsRouter.get('/',asyncHandler(async (req:Request<{}, any,any, CollectionsQuery>,res)=>{
    let where:WhereOptions<NftCollectionInferAttributes> = {isEnabled: true}

    if(req.query.filter?.name){
        where.name = req.query.filter.name.at(-1) == '%'
            ? {[Op.like]: req.query.filter?.name }
            : req.query.filter?.name
        
    }

    if(req.query.filter?.blockchain){
        where.blockchain = req.query.filter.blockchain
    }

    const findOptions: FindOptions<InferAttributes<NftCollection, {omit: never;}>> = {
            attributes:['id','name','type','symbol','blockchain', 'contract', 'imageUrl'],
            where,
            limit: parseInt(req.query.limit as string) || 10,
            offset: parseInt(req.query.offset as string) || 0
        },
        data = await NftCollection.findAll(findOptions),
        itemsTotal = await NftCollection.count({where: findOptions.where})

    res.json({data, itemsTotal})
}))

/**
 * @swagger
 * /collections/{id}:
 *  get:
 *      description: Get collection items
 *      tags: [Collections]
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
collectionsRouter.get('/:id(\\d+)', async(req, res)=>{
    

    const findOpts: FindOptions<NftItemCreationAttributes> = {
            attributes:['id','itemId','metaName','metaDescr'],
            include: {
                association: NftItem.associations.meta, 
                attributes:['url','type','representation','mimeType']
            },
            where: {    
                collectionId: parseInt(req.params.id)
            },
            limit: parseInt(req.query.limit as string) || 10,
            offset: parseInt(req.query.offset as string) || 0,
        },
        data = await NftItem.findAll(findOpts),
        itemsTotal = await NftItem.count({where: findOpts.where})

    res.json({data, itemsTotal})
})

/**
 * @swagger
 * /collections/last-updated:
 *  get:
 *      description: Get Nft items with order by last update DESC
 *      tags: [Collections]
 *      parameters:
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
collectionsRouter.get('/last-updated', asyncHandler(async (req, res)=>{
    const findOpts: FindOptions<InferAttributes<NftItem, {omit: never;}>> = {
        attributes:['id','itemId','metaName','metaDescr','bestSellDate'],
        include: {
            association: NftItem.associations.meta, 
            attributes:['url','type','representation','mimeType']
        },
        order: [['bestSellDate', 'DESC']],
        limit: parseInt(req.query.limit as string) || 10,
        offset: parseInt(req.query.offset as string) || 0,
    },
    data = await NftItem.findAll(findOpts),
    itemsTotal = await NftItem.count()

    res.json({data, itemsTotal})
}))