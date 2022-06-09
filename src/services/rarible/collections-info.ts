import { getCollectionsIterator } from "./collections-file-storage";
import { Blockchains } from "./types";

function run(){
    let col, bidCount = 0, sellCount = 0;
    const generator = getCollectionsIterator(Blockchains.ETHEREUM);
    
    while(!(col = generator.next()).done){
        col.value.forEach(c => {
            if(c.bestBidOrder){
                bidCount ++;
            }
    
            if(c.bestSellOrder){
                sellCount ++;
            }
        })
        
        console.log({bidCount, sellCount})
    }
}

run()