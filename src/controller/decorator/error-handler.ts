export function errorHandler(){
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        // Save a reference to the original method
        const originalMethod = descriptor.value
    
        // Rewrite original method with try/catch wrapper
        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args)
            } catch (error) {
                console.error('Failed to call controller:', error)
                args[args.length - 2].status(400).json({message: 'Unexpected error'})
            }
        }
    
        return descriptor;
    }
}