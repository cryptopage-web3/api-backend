
import { paginationValidator } from "./pagination-validator";
import { handleValidationErrors } from '../middleware/validator-middleware';

export function getTransactionsValidator(){
    return [
        ...paginationValidator(),
        handleValidationErrors
    ]
}