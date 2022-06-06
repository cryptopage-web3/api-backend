import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize'
import { db } from '../sequelize';

class NftCollection extends Model<InferAttributes<NftCollection>, InferCreationAttributes<NftCollection>> {
  declare collectionId:string
  declare name: string
  declare type: string
  declare symbol: string
}

NftCollection.init({
  collectionId: DataTypes.STRING(255),
  name: DataTypes.STRING(255),
  type: DataTypes.STRING(25),
  symbol: DataTypes.STRING(255)
}, {
  sequelize: db,
  modelName: 'NftCollection',
});  