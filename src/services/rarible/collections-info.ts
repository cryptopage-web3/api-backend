//sandbox for filter collections in files

import { getCollectionsIterator } from "./collections-file-storage";
import { Blockchains } from "./types";

async function run(){
    let col, bidCount = 0, sellCount = 0;
    const generator = getCollectionsIterator(Blockchains.POLYGON);
    
    col = generator.next()

    while(!col.done){
        col.value.forEach(c => {
            if(c.bestBidOrder){
                bidCount ++;
            }
    
            if(c.bestSellOrder){
                sellCount ++;
            }
        })
        
        console.log({bidCount, sellCount})

        col = generator.next()
    }
}


run()