
import { ethPaginationValidator, _paginationValidator } from "./pagination-validator";
import { handleValidationErrors } from '../middleware/validator-middleware';

export function getTransactionsValidator(){
    return [
        ..._paginationValidator(),
        ...ethPaginationValidator(),
        handleValidationErrors
    ]
}