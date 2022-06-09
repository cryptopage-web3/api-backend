import dotenv from 'dotenv'

dotenv.config()

import { readdirSync } from "fs";
import { resolve } from "path";
import { db } from "./sequelize";

const dir = resolve(__dirname,'model');

console.log(`load models dir: ${dir}`)

const files = readdirSync(dir, {withFileTypes: true});

files.forEach(f => {
    if(f.isFile() && f.name.split('.').pop() == 'js'){
        import (`./model/${f.name}`);
        console.log(`${f.name} loaded`)
    }
});

db.sync({alter: true}).then(()=>{
    console.log('Database updated')
})