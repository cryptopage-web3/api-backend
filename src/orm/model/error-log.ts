import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../sequelize';

export class ErrorLog extends Model<InferAttributes<ErrorLog>, InferCreationAttributes<ErrorLog>>{
    declare key: string
    declare descr: string | undefined
    declare context: string | undefined
    declare isSummarized: boolean | undefined
}

ErrorLog.init({
    key: DataTypes.STRING(255),
    descr: DataTypes.STRING(400),
    context: DataTypes.STRING(255),
    isSummarized: { type: DataTypes.BOOLEAN, defaultValue: false }
},{
    sequelize: db,
    indexes:[
        {fields:['isSummarized']}
    ]
})