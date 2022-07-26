import { query } from 'express-validator'
import { ChainId } from '../../modules/transactions/types';
import { handleValidationErrors } from '../middleware/validator-middleware';

export function _paginationValidator(){
    return [
        query('page').toInt().customSanitizer(v => isNaN(v) ? 1 : v).isInt({min: 1})
            .withMessage('Minimal value is 1'),
        query('pageSize').toInt().customSanitizer(v => isNaN(v) ? 10 : v).isInt({min: 1})
            .withMessage('Minimal value is 1')
    ]
}

export function ethPaginationValidator(){
    return [
        query('continue.tx').if(isEthChain)
            .toInt().customSanitizer(v => isNaN(v) ? 0 : v).isInt({min: 0})
            .withMessage('Minimal value is 0'),
        query('continue.erc20').if(isEthChain)
            .toInt().customSanitizer(v => isNaN(v) ? 0 : v).isInt({min: 0})
            .withMessage('Minimal value is 0'),
    ]
}

export function paginationValidator(){
    return [
        ..._paginationValidator(),
        handleValidationErrors
    ]
}

function isEthChain(value, { req }){
    return req.params.chain === ChainId.eth
}