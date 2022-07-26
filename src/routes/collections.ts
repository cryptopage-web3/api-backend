import { Request, Router } from "express";
import { FindOptions, InferAttributes, Op, WhereOptions } from "sequelize";
import { NftCollection, NftCollectionInferAttributes } from "../orm/model/nftcollection";
import { NftItem, NftItemCreationAttributes, NftItemInferAttributes } from "../orm/model/nftitem";
import { asyncHandler } from "../util/router";
import { CollectionsQuery, NftItemsQuery } from "./types";

export const collectionsRouter = Router();

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

collectionsRouter.get('/last-updated', asyncHandler(async (req:Request<{}, any,any, NftItemsQuery>, res)=>{
    const collectionFilter = req.query.filter?.collectionId ? [{
            association: NftItem.associations.collection,
            where: { id: req.query.filter.collectionId },
            attributes: []
        }] : [],
        findOpts: FindOptions<NftItemInferAttributes> = {
        attributes:['id','itemId','metaName','metaDescr','bestSellDate'],
        include: [{
            association: NftItem.associations.meta, 
            attributes:['url','type','representation','mimeType']
        }, ...(collectionFilter)],
        order: [['bestSellDate', 'DESC']],
        limit: parseInt(req.query.limit as string) || 10,
        offset: parseInt(req.query.offset as string) || 0,
    }

    const data = await NftItem.findAll(findOpts),
        itemsTotal = await NftItem.count({
            where: findOpts.where, 
            include: collectionFilter, 
            logging: console.log
        })

    res.json({data, itemsTotal})
}))