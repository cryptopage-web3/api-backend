import { config } from "dotenv";
import { ethers } from "ethers";
config()

import { ChainId } from "../modules/transactions/types";
import { PostSyncedBlock } from "../orm/model/post-synced-block";
import { envToString } from "../util/env-util";
import {abi} from "../services/web3/social-smart-contract/mumbai/comments-data-abi.json"
import { db } from "../orm/sequelize";
import { PostStatistic } from "../orm/model/post-statistic";

const allowedChains:string[] = [ChainId.mumbai];

if(allowedChains.indexOf(process.argv[2]) == -1){
    throw new Error(`Invalid chain: ${process.argv[2]}. Allowed chains: ${allowedChains.join(',')}`)
}

const chain:ChainId = process.argv[2] as ChainId;
const privateKey = envToString('COMMENTS_SYNC_PRIVATE_KEY')
const alchemyUrl = envToString('WEB3_RPC_URL_MUMBAI')
const contractAddress = '0x561F88B50289d37928c6AE8cbb49aEa00881B838';

const ethersProvider = new ethers.JsonRpcProvider(alchemyUrl);
const signer = new ethers.Wallet(privateKey, ethersProvider);
const contract = new ethers.Contract(contractAddress, abi, signer);


async function getBlockRange(lastSynced:PostSyncedBlock | null){
    const lastSyncedBlockNumber = lastSynced?.blockNumber,
        lastBlockNumberInBlockchain = await ethersProvider.getBlockNumber()

    if(!lastSyncedBlockNumber){
        return [-10000000, lastBlockNumberInBlockchain]
    }

    return [lastSyncedBlockNumber, lastBlockNumberInBlockchain]
}

(async function main(){
    const lastSyncedBlock = await PostSyncedBlock.findOne({where:{ chain }}),
        [fromBlock, toBlock] = await getBlockRange(lastSyncedBlock),
        filter = contract.filters.WriteComment(),
        comments = await contract.queryFilter(filter, fromBlock, toBlock);
    
    let transaction = db.transaction()

    const map = new Map<string,PostStatistic>()

    for (let i = 0; i < comments.length; i++ ) {
        const commentedPostId = (comments[i] as any).args[1];
        const blockNumber = comments[i].blockNumber;
        
        let cachedStat = map.get(commentedPostId)

        if(!cachedStat){
            const dbStat = await PostStatistic.findOne({where:{chain, postId: commentedPostId}})
            cachedStat = dbStat || undefined
        }

        if(cachedStat){
            cachedStat.totalCommentsCount += 1
            await cachedStat.save()
            continue
        }

        cachedStat = await PostStatistic.create({
            chain,
            postId: commentedPostId,
            totalCommentsCount: 1,
        })

        map.set(commentedPostId, cachedStat)
    }

    if(!lastSyncedBlock){
        await PostSyncedBlock.create({
            chain,
            blockNumber: toBlock
        })
    } else {
        lastSyncedBlock.blockNumber = toBlock
        await lastSyncedBlock.save()
    }

    (await transaction).commit()

    process.exit(0)

})();