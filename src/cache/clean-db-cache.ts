import { initEnvVariables } from '../env-init';

initEnvVariables()

import 'reflect-metadata'
import { container } from '../ioc';
import { IDS } from '../types/index';
import { safeStart } from '../util/safe-start';
import { NftTokenDetailsRepo } from '../orm/repo/nft-token-details-repo';
import { envToNumber } from '../util/env-util';

safeStart(async()=>{
    const ttl = envToNumber('NFT_DETAILS_CACHE_TTL_IN_MINUTES', 3);

    const repo:NftTokenDetailsRepo = container.get(IDS.ORM.REPO.NftTokenDetailsRepo)

    const removed = await repo.removeOldRecords(ttl)

    console.log(`Removed ${removed} NftTokenDetails cache rows`)

    process.exit(0)
})