import { InferAttributes, Model, InferCreationAttributes, DataTypes, CreationOptional } from 'sequelize';
import { db } from '../sequelize';
import { ChainId } from '../../modules/transactions/types';

export type NftTokenDetailsInferAttr = InferAttributes<NftTokenDetails>

export type NftTokenDetailsCreateAttr = InferCreationAttributes<NftTokenDetails>

export class NftTokenDetails extends Model<NftTokenDetailsInferAttr, NftTokenDetailsCreateAttr> {
    declare tokenId: string
    declare chain: string
    declare contractAddress: string
    declare creator: string | undefined
    declare name: string
    declare description: string
    declare contentUrl: string | undefined
    declare attributes: any[]
    declare attachments: any[] | undefined
    declare isEncrypted: boolean
    declare paymentType: number
    declare payAmount: string | undefined
    declare minimalPeriod: string | undefined
    declare date: CreationOptional<Date>
}

NftTokenDetails.init({
    tokenId: DataTypes.STRING(255),
    chain: DataTypes.ENUM(ChainId.eth, ChainId.bsc, ChainId.matic, ChainId.mumbai, ChainId.sol, ChainId.tron, ChainId.goerli),
    contractAddress: DataTypes.STRING(255),
    creator: DataTypes.STRING(255),
    name: DataTypes.STRING(255),
    description: DataTypes.STRING(2000),
    contentUrl: DataTypes.TEXT,
    attributes: DataTypes.JSON,
    attachments: DataTypes.JSON,
    isEncrypted: DataTypes.BOOLEAN,
    paymentType: DataTypes.INTEGER,
    payAmount: DataTypes.STRING,
    minimalPeriod: DataTypes.STRING(20),
    date: { type: DataTypes.DATE, allowNull: true }
},{
    sequelize: db
})