import { body } from "express-validator";
import { handleValidationErrors } from "../middleware/validator-middleware";

export function frontErrorValidator(){
    return [
        body('message')
            .notEmpty().withMessage('Message can not be empty'),
        body('callStack')
            .notEmpty().withMessage('Call stack can not be empty'),
        handleValidationErrors
    ]
}