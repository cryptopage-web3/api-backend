import { controller, httpGet, interfaces, queryParam, request, requestParam, response } from "inversify-express-utils";
import { errorHandler } from "./decorator/error-handler";
import { WhereOptions, Op, FindOptions, InferAttributes } from 'sequelize';
import { NftCollectionInferAttributes, NftCollection } from '../orm/model/nftcollection';
import * as express from 'express';
import { ICollectionsFilter, INftItemsFilter } from './types';
import { paginationValidator } from "./validator/pagination-validator";
import { NftItemCreationAttributes, NftItem, NftItemInferAttributes } from '../orm/model/nftitem';

@controller('/collections')
export class CollectionsController implements interfaces.Controller {
    
    @httpGet('/', ...paginationValidator())
    @errorHandler()
    async getCollections(
        @queryParam('page') page: number = 1,
        @queryParam('pageSize') pageSize: number = 10,
        @queryParam('filter') filter: ICollectionsFilter,
        @response() res: express.Response
    ){
        let where:WhereOptions<NftCollectionInferAttributes> = {isEnabled: true}

        if(filter?.name){
            where.name = filter.name.at(-1) == '%'
                ? {[Op.like]: filter?.name }
                : filter?.name
            
        }

        if(filter?.blockchain){
            where.blockchain = filter.blockchain
        }

        const findOptions: FindOptions<InferAttributes<NftCollection, {omit: never;}>> = {
                attributes:['id','name','type','symbol','blockchain', 'contract', 'imageUrl'],
                where,
                limit: pageSize,
                offset: (page - 1) * pageSize,
            },
            data = await NftCollection.findAll(findOptions),
            itemsTotal = await NftCollection.count({where: findOptions.where})

        res.json({data, itemsTotal})
    }

    @httpGet('/:id(\\d+)')
    @errorHandler()
    async getCollectionNfts(
        @requestParam('id') id: number,
        @queryParam('page') page: number = 1,
        @queryParam('pageSize') pageSize: number = 10,
        @response() res: express.Response
    ){
        const findOpts: FindOptions<NftItemCreationAttributes> = {
            attributes:['id','itemId','metaName','metaDescr'],
            include: {
                association: NftItem.associations.meta, 
                attributes:['url','type','representation','mimeType']
            },
            where: {    
                collectionId: id
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
        },
        data = await NftItem.findAll(findOpts),
        itemsTotal = await NftItem.count({where: findOpts.where})

        res.json({data, itemsTotal})
    }

    @httpGet('/market-dashboard',...paginationValidator())
    @errorHandler()
    async getMarketdashboard(
        @queryParam('filter') filter:INftItemsFilter,
        @queryParam('page') page: number = 1,
        @queryParam('pageSize') pageSize: number = 10,
        @response() res: express.Response
    ){
        const collectionFilter = filter?.collectionId ? [{
                association: NftItem.associations.collection,
                where: { id: filter.collectionId },
                attributes: []
            }] : [],
            findOpts: FindOptions<NftItemInferAttributes> = {
            attributes:['id','itemId','metaName','metaDescr','bestSellDate'],
            include: [{
                association: NftItem.associations.meta, 
                attributes:['url','type','representation','mimeType']
            }, ...(collectionFilter)],
            order: [['bestSellDate', 'DESC']],
            limit: pageSize,
            offset: (page - 1) * pageSize,
        }

        const data = await NftItem.findAll(findOpts),
            itemsTotal = await NftItem.count({
                where: findOpts.where, 
                include: collectionFilter, 
                logging: console.log
            })

        res.json({data, itemsTotal})
    }
}