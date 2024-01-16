import { InferAttributes, Model, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../sequelize';

export type UserInferAttr = InferAttributes<User>

export class User extends Model<UserInferAttr, InferCreationAttributes<User>> {
    declare address: string
    declare ip: string
}

User.init({
    address: DataTypes.STRING(128),
    ip: DataTypes.STRING(50)
},{
    sequelize: db,
    indexes:[{
        fields:['address'], unique: true
    }]
})