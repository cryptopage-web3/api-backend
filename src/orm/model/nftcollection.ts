import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize'
import { db } from '../sequelize';

export class NftCollection extends Model<InferAttributes<NftCollection>, InferCreationAttributes<NftCollection>> {
  declare collectionId:string
  declare name: string
  declare type: string
  declare symbol: string
  declare blockchain: string
  declare imageUrl: string
  declare hasBid: boolean
  declare hasSell: boolean
}

NftCollection.init({
  collectionId: DataTypes.STRING(255),
  name: DataTypes.STRING(255),
  type: DataTypes.STRING(25),
  symbol: DataTypes.STRING(355),
  blockchain: DataTypes.STRING(25),
  imageUrl: DataTypes.STRING(300),
  hasBid: {type: DataTypes.BOOLEAN, allowNull:false},
  hasSell: {type: DataTypes.BOOLEAN, allowNull:false}
}, {
  sequelize: db,
  modelName: 'NftCollection',
  indexes:[
    {unique: false, fields:['symbol']},
    {unique: false, fields:['collectionId']},
  ]
});  