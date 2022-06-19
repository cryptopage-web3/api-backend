import { Model, DataTypes, InferAttributes, InferCreationAttributes, ForeignKey } from 'sequelize'
import { db } from '../sequelize'
import { NftItem } from './nftitem'

export class MetaContent extends Model<InferAttributes<MetaContent>, InferCreationAttributes<MetaContent>> {
    declare nftId: ForeignKey<NftItem['id']>

    declare url: string
    declare type: string
    declare representation: string
    declare mimeType: string
}

MetaContent.init({
    url: DataTypes.STRING(400),
    type: DataTypes.STRING(15),
    representation: DataTypes.STRING(10),
    mimeType: DataTypes.STRING(50)
},{
    sequelize: db
})