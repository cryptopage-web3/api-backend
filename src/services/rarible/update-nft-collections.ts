//run once per hour

import { config } from 'dotenv'
import { InferAttributes, Op } from 'sequelize';

config();

import { NftCollection } from '../../orm/model/nftcollection';

import { safeStart } from '../../util/safe-start';
import { getCollectionsIterator } from './collections-file-storage';
import { Blockchains } from './types';


async function run(){
    let bulk, readCounter = 0, insertCounter = 0;
    const generator = getCollectionsIterator(Blockchains.POLYGON);

    while(!(bulk = generator.next()).done){
        const result = await saveCollections(bulk.value)

        console.log(result)
    }

    console.log(`Done. Total readed ${readCounter}, total inserted ${insertCounter}`)
}

async function saveCollections(list:Array<any>):Promise<{inserted:number,updated:number}> {
    const saveBulk:InferAttributes<NftCollection>[] = [],
        existsCollections = await NftCollection.findAll({
            where:{ collectionId: {[Op.in]: list.map(c => c.id)}
        }})

    let updated = 0,
        inserted = 0;

    for(let i in list){
        const collectionData = list[i],
            existsRow = existsCollections.find(o => o.collectionId == collectionData.id),
            updatedRow = buildCollection(list[i]);

        if(!existsRow){
            saveBulk.push(updatedRow)
        } else {
            existsRow.hasBid = updatedRow.hasBid
            existsRow.hasSell = updatedRow.hasSell

            await existsRow.save()

            updated ++;
        }
    }

    if(saveBulk.length > 0){
        await NftCollection.bulkCreate(saveBulk)
            .catch(async (bulkErr) =>{
                console.error('Failed to save bulk', bulkErr)

                console.log('Try to save one by one')
                
                for (let i in saveBulk){
                    await NftCollection.create(saveBulk[i])
                        .catch(singleErr => {
                            console.error('Failed to save singe row', singleErr, 'item', saveBulk[i])
                        })
                }
            })

        inserted += saveBulk.length
    }

    return {inserted , updated}
}

function buildCollection(data):InferAttributes<NftCollection> {
    let isEnabled = false;

    if(data.blockchain == Blockchains.ETHEREUM && !!data.bestBidOrder){
        isEnabled = true
    } else if(data.blockchain == Blockchains.POLYGON){
        isEnabled = !!data.meta?.content[0]?.url
    }

    return {
        collectionId: data.id,
        name: data.name,
        type: data.type,
        symbol: data.symbol,
        blockchain: data.blockchain,
        imageUrl: data.meta?.content[0]?.url,
        hasBid: !!data.bestBidOrder,
        hasSell: !!data.bestSellOrder,
        isEnabled
    }
}

safeStart(run);