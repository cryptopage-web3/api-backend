import { body } from "express-validator";
import { handleValidationErrors } from "../middleware/validator-middleware";

export function userLogValidator(){
    const addressMinLen = 32;
    
    return [
        body('address')
            .notEmpty().withMessage('Address can not be empty')
            .isLength({ min: addressMinLen}).withMessage(`Min length is ${addressMinLen}`),
        handleValidationErrors
    ]
}