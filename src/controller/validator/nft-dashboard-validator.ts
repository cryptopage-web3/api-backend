import { query } from "express-validator";
import { handleValidationErrors } from "../middleware/validator-middleware";

export function buildNftDashboardValidator(){
    return [
        query('count')
            .optional()
            .isInt({min:1}).withMessage('Minimal value is 1')
            .toInt(),
        handleValidationErrors
    ]
}