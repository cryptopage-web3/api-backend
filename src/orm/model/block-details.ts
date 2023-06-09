import { InferAttributes, Model, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { ChainId } from '../../modules/transactions/types';

export type BlockDetailsInferAttr = InferAttributes<BlockDetails>

export class BlockDetails extends Model<BlockDetailsInferAttr, InferCreationAttributes<BlockDetails>> {
    declare blockNumber: number
    declare blockDate: Date
    declare chain: ChainId
}

BlockDetails.init({
    blockNumber: DataTypes.INTEGER,
    blockDate: DataTypes.DATE,
    chain: DataTypes.ENUM(ChainId.eth, ChainId.bsc, ChainId.matic, ChainId.mumbai, ChainId.sol, ChainId.tron, ChainId.goerli),
},{
    sequelize: db
})