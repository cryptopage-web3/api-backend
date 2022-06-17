import { Model, DataTypes, InferAttributes, InferCreationAttributes, HasManyGetAssociationsMixin, NonAttribute, Association, ForeignKey } from 'sequelize'
import { db } from '../sequelize'
import { MetaContent } from './meta-content'
import { NftCollection } from './nftcollection'

export type NftitemCreationAttributes = InferCreationAttributes<NftItem, { omit: 'meta'}>

export class NftItem extends Model<InferAttributes<NftItem, {omit: 'meta'}>,  NftitemCreationAttributes> {
    get id():NonAttribute<number>{
        return (this as any).id
    }
    declare collectionId: ForeignKey<NftCollection['id']>
    declare collection?: NonAttribute<NftCollection>

    declare itemId: string
    //declare raribleCollectionId: string
    declare metaName: string | null
    declare metaDescr: string | null

    declare bestSellMakePriceUsd: number | null
    declare bestSellMakePrice: number | null

    declare getMetaContent: HasManyGetAssociationsMixin<MetaContent>
    declare meta?: NonAttribute<MetaContent[]>
    declare static associations:{
        meta: Association<NftItem, MetaContent>
    }
}

NftItem.init({
    itemId: DataTypes.STRING(300),
    metaName: DataTypes.STRING(128),
    metaDescr: DataTypes.STRING(2000),
    bestSellMakePriceUsd: {type: DataTypes.DECIMAL(20,2), allowNull: true},
    bestSellMakePrice: {type: DataTypes.DECIMAL(30,8), allowNull: true}
},{
    sequelize: db,
    indexes:[
        {unique: false, fields:['itemId']},
    ]
});

NftItem.hasMany(MetaContent,{ 
    sourceKey: 'id',
    foreignKey: 'nftId',
    as: 'meta'
})