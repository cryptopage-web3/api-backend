import { InferAttributes, Model, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../sequelize';
import { ChainId } from '../../modules/transactions/types';

export type FrontErrorInferAttr = InferAttributes<FrontError>

export class FrontError extends Model<FrontErrorInferAttr, InferCreationAttributes<FrontError>> {
    declare message: string
    declare callStack: string
    declare ip: string
    declare context?: any
}

FrontError.init({
    message: DataTypes.STRING(2000),
    callStack: DataTypes.TEXT,
    ip:DataTypes.STRING(15),
    context: DataTypes.JSON
},{
    sequelize: db
})