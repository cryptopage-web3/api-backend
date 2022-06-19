//sandbox for filter collections in files

import { getCollectionsIterator } from "./collections-file-storage";
import { Blockchains } from "./types";

async function run(){
    let col, bidCount = 0, sellCount = 0, withPrice = 0;
    const generator = getCollectionsIterator(Blockchains.ETHEREUM);
    
    col = generator.next()

    while(!col.done){
        col.value.forEach(c => {
            if(c.bestBidOrder){
                bidCount ++;
            }
    
            if(c.bestSellOrder){
                sellCount ++;
            }

            if(c.bestBidOrder?.takePriceUsd){
                const price = Math.floor( parseFloat(c.bestBidOrder.takePriceUsd) * 100) / 100

                if(price > 100){
                    withPrice++
                    console.log(price)
                }
            }
        })
        
        console.log({withPrice, bidCount, sellCount})

        col = generator.next()
    }
}


run()