import sequelize from 'sequelize'
import { envToInt, envToString } from '../util/env-util'

export const db = new sequelize.Sequelize(
    envToString('DB_NAME'),
    envToString('DB_USER'),
    envToString('DB_PASSWORD', ''),{
        dialect: 'mysql',
        host: envToString('DB_HOST', '127.0.0.1'),
        port: envToInt('DB_PORT', 3306),
        connectTimeout: 60000,
        pool: {
            min: 1,
            max: 100,
            acquire: 30000,
            idle: 20000,
        },
        define:{
            charset: 'utf8mb4',
            //collate: 'utf8mb4_bin'
        },
        logging: false
    }
)