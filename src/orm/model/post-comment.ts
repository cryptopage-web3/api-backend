import { InferAttributes, Model, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { ChainId } from '../../modules/transactions/types';

export type PostCommentInferAttr = InferAttributes<PostComment>

export class PostComment extends Model<PostCommentInferAttr, InferCreationAttributes<PostComment>> {
    declare blockNumber: number
    declare blockDate: Date
    declare chain: ChainId
    declare postId: string
    declare commentId: number
    declare isUp: boolean
}

PostComment.init({
    blockNumber: DataTypes.INTEGER,
    blockDate: DataTypes.DATE,
    chain: DataTypes.ENUM(ChainId.eth, ChainId.bsc, ChainId.matic, ChainId.mumbai, ChainId.sol, ChainId.tron, ChainId.goerli),
    postId: DataTypes.STRING(18),
    commentId: DataTypes.INTEGER,
    isUp: DataTypes.BOOLEAN
},{
    sequelize: db
})