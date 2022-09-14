import { InferAttributes, Model, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { ChainId } from '../../modules/transactions/types';

export type NftTokenDetailsInferAttr = InferAttributes<NftTokenDetails>

export class NftTokenDetails extends Model<NftTokenDetailsInferAttr, InferCreationAttributes<NftTokenDetails>> {
    declare tokenId: string
    declare chain: string
    declare contractAddress: string
    declare name: string
    declare type: string
    declare description: string
    declare url: string
    declare attributes: any[]
}

NftTokenDetails.init({
    tokenId: DataTypes.STRING(255),
    chain: DataTypes.ENUM(ChainId.eth, ChainId.bsc, ChainId.matic, ChainId.sol, ChainId.tron, ChainId.goerli),
    contractAddress: DataTypes.STRING(255),
    name: DataTypes.STRING(255),
    type: DataTypes.STRING(100),
    description: DataTypes.STRING(2000),
    url: DataTypes.STRING(600),
    attributes: DataTypes.JSON
},{
    sequelize: db
})