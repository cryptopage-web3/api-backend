import { Router } from "express";
import { FindOptions, InferAttributes } from "sequelize/types";
import { NftCollection } from "../orm/model/nftcollection";

export const collectionsRouter = Router();

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