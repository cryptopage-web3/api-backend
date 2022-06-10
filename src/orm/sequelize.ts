import sequelize from 'sequelize'
import { envToInt, envToString } from '../util/env-util'

export const db = new sequelize.Sequelize(
    envToString('DB_NAME'),
    envToString('DB_USER'),
    envToString('DB_PASSWORD', ''),{
        dialect: 'mysql',
        host: envToString('DB_HOST', '127.0.0.1'),
        port: envToInt('DB_PORT', 3306),
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
        define:{
            charset: 'utf8mb4',
            //collate: 'utf8mb4_bin'
        },
        logging: false
    }
)