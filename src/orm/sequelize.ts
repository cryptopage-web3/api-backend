import sequelize from 'sequelize'

export const db = new sequelize.Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD,{
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT as string) || 3306,
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