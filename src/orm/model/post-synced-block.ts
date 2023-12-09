import { InferAttributes, Model, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { ChainId } from '../../modules/transactions/types';

export type PostSyncedBlockInferAttr = InferAttributes<PostSyncedBlock>

export class PostSyncedBlock extends Model<PostSyncedBlockInferAttr, InferCreationAttributes<PostSyncedBlock>> {
    declare blockNumber: number
    declare chain: ChainId
}

PostSyncedBlock.init({
    blockNumber: DataTypes.INTEGER,
    chain: DataTypes.ENUM(ChainId.eth, ChainId.bsc, ChainId.matic, ChainId.mumbai, ChainId.sol, ChainId.tron, ChainId.goerli),
},{
    sequelize: db
})