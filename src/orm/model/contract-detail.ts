import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { db } from '../sequelize';
import { ChainId } from '../../modules/transactions/types';

export class ContractDetails extends Model<InferAttributes<ContractDetails>, InferCreationAttributes<ContractDetails>> {
    declare contractAddress: string
    declare symbol: string
    declare name: string
    declare descr: string
    declare chain: string
    declare url: string
}

ContractDetails.init({
    contractAddress: DataTypes.STRING(400),
    symbol: DataTypes.STRING(25),
    name: DataTypes.STRING(255),
    descr: DataTypes.STRING(2000),
    chain: DataTypes.ENUM(ChainId.eth, ChainId.bsc, ChainId.matic, ChainId.sol, ChainId.tron),
    url: DataTypes.STRING(400)
},{
    sequelize: db
})