const { validationResult } = require('express-validator');

export async function handleValidationErrors(req,res,next){
    const result = await validationResult(req);
    
    if(!result.isEmpty()){
        return res.status(200).json({ 
            status:'error',
            message: 'Invalid request',
            validationErrors: result.mapped()
        });
    }

    next();
}