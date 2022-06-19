export function asyncHandler(handler) {
    return async function (req, res, next) {
        try {
            await handler(req, res, next)    
        } catch (error) {
            console.error(error)
            next(error);
        }       
    }
}