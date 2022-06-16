import { config } from "dotenv";
config()

import { InferCreationAttributes, Op } from "sequelize";
import { MetaContent } from "../../orm/model/meta-content";
import { NftCollection } from "../../orm/model/nftcollection";

import { NftItem, NftitemCreationAttributes } from "../../orm/model/nftitem";
import { safeStart } from "../../util/safe-start";
import { getNftItemIterator } from "./nft-item-file-storage";
import { Blockchains, NftItemFilesIterator } from "./types";

async function run(){
    let bulk:NftItemFilesIterator//, readCounter = 0, insertCounter = 0;

    const generator = getNftItemIterator(Blockchains.ETHEREUM)

    while(!(bulk = generator.next()).done){
        const collection = await  NftCollection.findByPk(parseInt(bulk.value.collection),{
            include: []
        })
        if(collection){
            const {inserted} = await await saveItems(collection, bulk.value.items)
            console.log({inserted})
        }
    }
}

async function saveItems(collection:NftCollection, fileItems:Array<any>):Promise<{inserted:number,updated:number}>{
    const saveBulk:NftitemCreationAttributes[] = [],
        fileIds = fileItems.map(i => i.id),
        existsItems = await NftItem.findAll({
            where:{ itemId:{[Op.in]: fileIds}
        }})

    let updated = 0,
        inserted = 0;

    for(let fItem of fileItems){  
        if(existsItems.find(i => i.itemId === fItem.id)){
            continue
        }

        saveBulk.push(buildNftItem(collection, fItem))
    }

    if(saveBulk.length > 0){
        await NftItem.bulkCreate(saveBulk,{ 
            include:{ association: NftItem.associations.meta }
        })
        .then(()=>{ inserted += saveBulk.length })
        .catch(async err => {
            console.error('Failed to save bulk')
            console.error(err)

            console.log('Try to save one by one')

            for(let i of saveBulk){
                await NftItem.create(i,{ 
                    include:{ association: NftItem.associations.meta }
                })
                .then(()=>{ inserted ++})
                .catch(singleErr =>{
                    console.error("failed to save single NftItem", singleErr)
                    console.error(singleErr)
                })
            }
        })

        if(!collection.contract && fileItems[0].contract){
            collection.contract = fileItems[0].contract
            
            await collection.save()
        }
    }

    return {updated, inserted}
}

function buildNftItem(collection:NftCollection, nftData):NftitemCreationAttributes{
    const meta = buildNftItemMeta(nftData)

    return {
        itemId: nftData.id,
        contract: nftData.contract,
        metaName: nftData.meta?.name,
        metaDescr: nftData.meta?.description,
        meta,
        collection
    }
}

function buildNftItemMeta(data):InferCreationAttributes<MetaContent>[] | undefined {
    return data?.meta?.content.map(m => ({
        url: m.url,
        type: m['@type'],
        representation: m.representation,
        mimeType: m.mimeType
    }))
}

safeStart(run)