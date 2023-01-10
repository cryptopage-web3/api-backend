import dotenv from 'dotenv'

dotenv.config()

import { readdirSync } from "fs";
import { resolve } from "path";
import { db } from "./sequelize";

function allowSql(sql:string){
    const allow = ['SET','SELECT','SHOW']
    for(let i in allow){
        if(sql.startsWith(allow[i])){
            return true
        }
    }
    return false
}

(async ()=>{
    const dbLink = db as any
    const origdbQuery = db.query as any

    dbLink.query = function(...opts){
        //console.log('dbLink.query:',opts)
        return origdbQuery.call(dbLink, ...opts)
    }

    const man = db.connectionManager as any
    const origMethod = man.getConnection
    man.getConnection = async function (...opts){
        const conn = await origMethod.call(man,...opts)
        const origQuery = conn.query
        
        conn.query = function(...qopts){
            const sql:string = qopts[0].sql || qopts[0];
            
            if(allowSql(sql) ){
                //console.log('run', sql)
                return origQuery.call(conn,...qopts)
            } else {
                console.log(sql)
                qopts[1](null, {constructor:{},reduce:()=>{}})
                return {setMaxListeners: ()=>{}}
            }
        }

        return conn
    }

    const dir = resolve(__dirname,'model');

    console.log(`load models dir: ${dir}`)

    const files = readdirSync(dir, {withFileTypes: true});

    files.forEach(f => {
        if(f.isFile() && f.name.split('.').pop() == 'js'){
            import (`./model/${f.name}`);
            console.log(`${f.name} loaded`)
        }
    });

    await db.sync({ alter: true }).then(()=>{
        console.log('Database updated')
    })
})() 





/**/