import { Model, DataTypes, InferAttributes, InferCreationAttributes, HasManyGetAssociationsMixin, NonAttribute, Association, HasManyAddAssociationsMixin } from 'sequelize'
import { db } from '../sequelize';
import { NftItem } from './nftitem';

export class NftCollection extends Model<InferAttributes<NftCollection>, InferCreationAttributes<NftCollection>> {
  get id():NonAttribute<number>{
    return (this as any).id
  }

  declare collectionId:string
  declare name: string
  declare takePriceUsd: number
  declare type: string
  declare symbol: string
  declare blockchain: string
  declare contract?: string
  declare imageUrl: string
  declare hasBid: boolean
  declare hasSell: boolean
  declare isEnabled: boolean
  declare lastReadFromApi: Date | null

  declare getItems: HasManyGetAssociationsMixin<NftItem>
  declare items?: NonAttribute<NftItem[]>
  declare addItems: HasManyAddAssociationsMixin<NftItem, number>;
  declare static associations:{
    items: Association<NftItem>
  }
}

NftCollection.init({
  collectionId: DataTypes.STRING(255),
  name: DataTypes.STRING(255),
  takePriceUsd: DataTypes.DECIMAL(20,2),
  type: DataTypes.STRING(25),
  symbol: DataTypes.STRING(355),
  blockchain: DataTypes.STRING(25),
  contract: {type: DataTypes.STRING(128), allowNull: true},
  imageUrl: DataTypes.STRING(300),
  hasBid: {type: DataTypes.BOOLEAN, allowNull:false},
  hasSell: {type: DataTypes.BOOLEAN, allowNull:false},
  isEnabled: {type: DataTypes.BOOLEAN, allowNull:false, defaultValue: true},
  lastReadFromApi: {type: DataTypes.DATE, defaultValue: null, allowNull: true}
}, {
  sequelize: db,
  modelName: 'NftCollection',
  indexes:[
    {unique: false, fields:['symbol']},
    {unique: false, fields:['collectionId']},
    {unique: false, fields:['isEnabled']},
  ]
});

NftCollection.hasMany(NftItem,{
  sourceKey: 'id',
  foreignKey: 'collectionId',
  as: 'items'
})