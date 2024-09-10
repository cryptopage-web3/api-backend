import { config } from "dotenv";
import { ethers } from "ethers";
config()

import { ChainId } from "../modules/transactions/types";
import { PostSyncedBlock } from "../orm/model/post-synced-block";
import { envToString } from "../util/env-util";
import { db } from "../orm/sequelize";
import { PostStatistic } from "../orm/model/post-statistic";
import { ChainEvent } from "../orm/types";
import { safeStart } from "../util/safe-start";
import { maticCommentsDataContractInfo } from "../services/web3/social-smart-contract/matic/comments-data-contract";
import { maticPostDataContractInfo } from "../services/web3/social-smart-contract/matic-postdata-contract";

const allowedChains:string[] = [ChainId.matic];

const chain:ChainId = ChainId.matic;
/*
if(allowedChains.indexOf(process.argv[2]) == -1){
    throw new Error(`Invalid chain: ${process.argv[2]}. Allowed chains: ${allowedChains.join(',')}`)
}*/

const privateKey = envToString('COMMENTS_SYNC_PRIVATE_KEY')
const alchemyUrl = envToString('WEB3_RPC_URL_MATIC')

const ethersProvider = new ethers.JsonRpcProvider(alchemyUrl);
const signer = new ethers.Wallet(privateKey, ethersProvider);
let lastBlockNumberInBlockchain

const skipLtTokens = {
    [ChainId.mumbai]: 155
}

async function getBlockRange(lastSynced:PostSyncedBlock | null){
    const lastSyncedBlockNumber = lastSynced?.blockNumber

    if(!lastBlockNumberInBlockchain){
        lastBlockNumberInBlockchain = await ethersProvider.getBlockNumber()
    }

    if(!lastSyncedBlockNumber){
        return [-10000000, lastBlockNumberInBlockchain]
    }

    return [lastSyncedBlockNumber, lastBlockNumberInBlockchain]
}

function canSkip(tokenId:string){
    if(!skipLtTokens[chain]){
        return false
    }

    const tId = tokenId.substring(5),
        intTid = parseInt(tId)

    return intTid <= skipLtTokens[chain]
}

function getContractAndFilter(event:ChainEvent){
    if(event == ChainEvent.writeComment){
        const {constractAddress, abi} = maticCommentsDataContractInfo,
            contract = new ethers.Contract(constractAddress, abi, signer),
            filter = contract.filters.WriteComment();
        
        return {contract, filter}
    }
    if(event == ChainEvent.writePost){
        const {constractAddress, abi} = maticPostDataContractInfo,
            contract = new ethers.Contract(constractAddress, abi, signer),
            filter = contract.filters.WritePost();

        return {contract, filter}
    }
    if(event == ChainEvent.burnPost){
        const {constractAddress, abi} = maticPostDataContractInfo,
            contract = new ethers.Contract(constractAddress, abi, signer),
            filter = contract.filters.BurnPost();

        return {contract, filter}
    }

    throw new Error(`Unknown event: ${event}`)
}

async function syncPostEvent(event:ChainEvent){
    console.log(`syncEvent ${event} started:`, new Date())
    const lastSyncedBlock = await PostSyncedBlock.findOne({where:{ chain, event }}),
        [fromBlock, toBlock] = await getBlockRange(lastSyncedBlock),
        {contract, filter} = getContractAndFilter(event),
        events = await contract.queryFilter(filter, fromBlock, toBlock);
    
    console.log(`block range ${fromBlock} - ${toBlock}`)

    let transaction = db.transaction()

    const map = new Map<string,PostStatistic>()

    for (let i = 0; i < events.length; i++ ) {
        const eventPostId = (events[i] as any).args[1].toString();
        
        if(canSkip(eventPostId)){
            console.log('skipped', eventPostId)
            continue
        }

        if(event == ChainEvent.burnPost){
            await PostStatistic.destroy({where:{
                chain,
                postId: eventPostId
            }})

            console.log(`removed post ${eventPostId}`)
            continue
        }
        
        let cachedStat = map.get(eventPostId)

        if(!cachedStat){
            const dbStat = await PostStatistic.findOne({where:{chain, postId: eventPostId}})
            cachedStat = dbStat || undefined
        }

        if(cachedStat && ChainEvent.writeComment == event){
            cachedStat.totalCommentsCount += 1
            await cachedStat.save()
            console.log(eventPostId,'updated from cache')
        }

        if(cachedStat){
            continue
        }

        if([ChainEvent.writeComment,ChainEvent.writePost].includes(event)){
            cachedStat = await PostStatistic.create({
                chain,
                postId: eventPostId,
                totalCommentsCount: event == ChainEvent.writeComment ? 1 : 0,
            })
    
            console.log(eventPostId,'inserted new row')
    
            map.set(eventPostId, cachedStat)
        }
        
    }

    if(!lastSyncedBlock){
        await PostSyncedBlock.create({
            chain,
            event,
            blockNumber: toBlock
        })
    } else {
        lastSyncedBlock.blockNumber = toBlock
        await lastSyncedBlock.save()
    }

    (await transaction).commit()
}

async function main(){
    const events = [ChainEvent.writePost,ChainEvent.writeComment, ChainEvent.burnPost]
    for(let e of events){
        await safeStart(syncPostEvent,{
            params:[e],
        })
    }
    
    console.log('Done: ', new Date())

    process.exit(0)
}

main()