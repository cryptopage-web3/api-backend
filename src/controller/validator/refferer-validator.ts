import * as express from 'express';

export function reffererValidator(allowed:string[]){
    return function validateRefferer(req:express.Request, res, next){
        const isRefAllowed = allowed.filter(a => req.headers.referer?.includes(a)).length > 0
        
        if(req.headers.referer){
            console.log('ref:',req.headers.referer)
        }

        if(!isRefAllowed){
            return res.status(403).end()
        }

        next()
    } 
}