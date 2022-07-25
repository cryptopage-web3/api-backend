import { query } from 'express-validator'
import { ChainId } from '../../modules/transactions/types';

export function paginationValidator(){
    return [
        query('skip').if(isNotEthChain)
            .toInt().customSanitizer(v => isNaN(v) ? 1 : v).isInt({min: 1})
            .withMessage('Minimal value is 1'),
        query('limit').if(isNotEthChain)
            .toInt().customSanitizer(v => isNaN(v) ? 1 : v).isInt({min: 1})
            .withMessage('Minimal value is 1'),
        query('continue.tx').if(isEthChain)
            .toInt().customSanitizer(v => isNaN(v) ? 0 : v).isInt({min: 0})
            .withMessage('Minimal value is 0'),
        query('continue.erc20').if(isEthChain)
            .toInt().customSanitizer(v => isNaN(v) ? 0 : v).isInt({min: 0})
            .withMessage('Minimal value is 0'),
    ]
}

function isEthChain(value, { req }){
    return req.params.chain === ChainId.eth
}

function isNotEthChain(value, { req }){
    return !isEthChain(value, { req })
}