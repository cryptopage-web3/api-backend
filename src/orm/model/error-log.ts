import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../sequelize';

export class ErrorLog extends Model<InferAttributes<ErrorLog>, InferCreationAttributes<ErrorLog>>{
    declare key: string
}

ErrorLog.init({
    key: DataTypes.STRING(255)
},{
    sequelize: db
})