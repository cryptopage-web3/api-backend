import { InferAttributes, Model, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { ChainId } from '../../modules/transactions/types';

export type NftTokenDetailsInferAttr = InferAttributes<NftTokenDetails>

export class NftTokenDetails extends Model<NftTokenDetailsInferAttr, InferCreationAttributes<NftTokenDetails>> {
    declare tokenId: string
    declare chain: string
    declare contractAddress: string
    declare name: string
    declare description: string
    declare contentUrl: string | undefined
    declare attributes: any[]
    declare isEncrypted: boolean
    declare accessPrice: string | undefined
    declare accessDuration: string | undefined
}

NftTokenDetails.init({
    tokenId: DataTypes.STRING(255),
    chain: DataTypes.ENUM(ChainId.eth, ChainId.bsc, ChainId.matic, ChainId.mumbai, ChainId.sol, ChainId.tron, ChainId.goerli),
    contractAddress: DataTypes.STRING(255),
    name: DataTypes.STRING(255),
    description: DataTypes.STRING(2000),
    contentUrl: DataTypes.TEXT,
    attributes: DataTypes.JSON,
    isEncrypted: DataTypes.BOOLEAN,
    accessPrice: DataTypes.STRING,
    accessDuration: DataTypes.STRING
},{
    sequelize: db
})