import { InferAttributes, Model, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { ChainId } from '../../modules/transactions/types';

export type PostStatisticInferAttr = InferAttributes<PostStatistic>

export class PostStatistic extends Model<PostStatisticInferAttr, InferCreationAttributes<PostStatistic>> {
    declare chain: ChainId
    declare postId: string
    declare totalCommentsCount: number
}

PostStatistic.init({
    chain: DataTypes.ENUM(ChainId.eth, ChainId.bsc, ChainId.matic, ChainId.mumbai, ChainId.sol, ChainId.tron, ChainId.goerli),
    postId: DataTypes.STRING(18),
    totalCommentsCount: DataTypes.INTEGER
},{
    sequelize: db
})