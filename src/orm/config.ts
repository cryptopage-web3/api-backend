import dotenv from 'dotenv'

dotenv.config()

import { envToString, envToInt } from '../util/env-util';

const conf = {
    username: envToString('DB_USER'),
    password: envToString('DB_PASSWORD', ''),
    database: envToString('DB_NAME'),
    host: envToString('DB_HOST', '127.0.0.1'),
    port: envToInt('DB_PORT', 3306),
    dialect: 'mysql',
}

//console.log('db conf', conf)

export const development = conf
export const production = conf