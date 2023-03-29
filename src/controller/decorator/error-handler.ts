import { ApiError } from '../../types/index';
import { getLogger } from '../../util/logger';

const logger = getLogger('controller-error-handler')

export function errorHandler(){
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        // Save a reference to the original method
        const originalMethod = descriptor.value
    
        // Rewrite original method with try/catch wrapper
        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args)
            } catch (error) {
                if(process.env.PREVENT_LOG_ERRORS !== 'yes'){
                    logger.error('Failed to call controller:', args[args.length - 3].originalUrl, error)
                }
                
                const message = error instanceof ApiError ? error.message : 'Unexpected error'
                args[args.length - 2].status(500).json({message})
            }
        }
    
        return descriptor;
    }
}