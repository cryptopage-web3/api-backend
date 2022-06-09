import { config } from 'dotenv'

config();

import { getAllCollections } from './api';
import { Blockchains } from './types';
import { safeStart } from '../../util/safe-start';
import { DATA_DIR } from '../../util/data-util';
import { getCollectionsContinue, initCollectionsDir, saveCollectionsContinue, saveCollectionToFile } from './collections-file-storage';

async function run (){
    console.log('data dir', DATA_DIR);

    const blockchains = Blockchains.POLYGON

    initCollectionsDir(blockchains)

    let bulk,     
        {continuation = undefined, readCounter = 0} = getCollectionsContinue(blockchains)

    while(bulk = await getAllCollections({size:1000, blockchains, continuation })){
        readCounter += bulk.collections.length
        continuation = bulk.continuation
        
        saveCollectionToFile(blockchains,readCounter.toString(), bulk.collections)

        if(bulk.length < 1000 || !bulk.continuation){
            saveCollectionsContinue(blockchains, null, null)
            break
        } else {
            saveCollectionsContinue(blockchains, continuation, readCounter)
        }
        
    }

    console.log('Done')
}

safeStart(run)