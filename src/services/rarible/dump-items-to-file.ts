import { config } from 'dotenv'
config();
import { Op } from 'sequelize';
import { NftCollection } from '../../orm/model/nftcollection';

import { safeStart } from '../../util/safe-start';
import { getCollectionItems } from './api';

import { cleanupNftItemsDir, getNftItemContinue, initNftContinueDir, initNftItemsDir, saveNftItemsContinue, saveNftItemsToFile } from './nft-item-file-storage';
import { Blockchains } from './types';



async function run(){
    const blockchain = Blockchains.ETHEREUM

    initNftContinueDir(blockchain)

    let collectionInfo,
        {offset = 0} = getNftItemContinue(blockchain)

    const generator = getCollectionGenerator(blockchain, offset)
    
    while(!(collectionInfo = await generator.next()).done){
        await saveCollectionItems(collectionInfo.value.collection, blockchain)
        saveNftItemsContinue(blockchain, {offset: collectionInfo.value.offset + 1})
    }

    saveNftItemsContinue(blockchain, {offset:0, collections: undefined})
}

function getCollectionGenerator(blockchain: Blockchains, startOffset = 0){
    let collectionsWithPrice, offset = startOffset;

    async function* getNextCollection(){
        while(collectionsWithPrice = await NftCollection.findOne({
            where:{
                takePriceUsd: {[Op.gte]: 100},
                blockchain
            }, limit: 1, offset, order: ['id']
        })){
            yield {collection: collectionsWithPrice, offset}
            
            offset++;
        }
    }

    return getNextCollection()
}

async function saveCollectionItems(collection:NftCollection, blockchain: Blockchains){
    let apiResponse, 
        { collection: lastContinue} = getNftItemContinue(blockchain),
        continuation = lastContinue?.[collection.id],
        bulkCounter = lastContinue?.bulkCounter || 0

    if(!continuation){
        cleanupNftItemsDir(blockchain, collection.id)
    } else {
        initNftItemsDir(blockchain, collection.id)
    }
        
    while(apiResponse = await getCollectionItems({ collection: collection.collectionId, size: 1000, continuation})){
        continuation = apiResponse.continuation
        bulkCounter++
        
        saveNftItemsToFile(blockchain, collection.id.toString(), bulkCounter.toString(), apiResponse.items)

        if(apiResponse.items.length < 1000 || !continuation){
            break
        }
        //saveNftItemsContinue(blockchain, {collection:{[collection.id]: continuation, bulkCounter}})
    }

    //saveNftItemsContinue(blockchain,{ collection:{[collection.id]: undefined, bulkCounter: 0}})
}

safeStart(run)