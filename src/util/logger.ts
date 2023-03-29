const log4js = require('log4js');

const NODE_ENV_DEVELOPMENT = 'development';
const NODE_ENV_PRODUCTION = 'production';
    
const LOGGER_NAMESPACE = 'logger';

const LOG_LEVEL_ERROR = 'error';
const LOG_LEVEL_INFO = 'info';
const LOG_LEVEL_WARN = 'warn';
const LOG_LEVEL_DEBUG = 'debug';
const LOG_LEVEL_TRACE = 'trace';
const LOG_LEVEL_OFF = 'off';

const IS_LOGGER_NAMESPACE_DISABLED = isLoggerDisabled();

const instances = {},
    wrappedInstances = {};

initLog4js();

function initLog4js(){
    const categories = Object.assign({},
        {
            default: {
                appenders: ['console'],
                level: getLog4jsDefaultCategoryLevel() 
            }
        },
        getCategoriesConfigFromEnv());

    log4js.configure({
        appenders: { console: { type: 'console' } },
        categories
    });
}

function getLog4jsDefaultCategoryLevel(){
    return isDev() ? LOG_LEVEL_DEBUG : LOG_LEVEL_INFO;
}

function getCategoriesConfigFromEnv(){
    const env = process.env.DEBUG || '';
    const result = {};

    const categoriesRawConfig = env.split(',');

    categoriesRawConfig.forEach(function(categoryConfig){
        const chunks = categoryConfig.split(':'),
            logLevel = chunks.pop(),
            categoryName = chunks.join(':');

        if(!logLevel || !isValidLogLevel(logLevel) || !categoryName){
            return;
        }

        result[categoryName] = {
            appenders: ['console'], 
            level: logLevel
        };

        if(!isLoggerDisabled()){
            //console.log('%s log level %s', categoryName, logLevel);
        }
    });

    return result;
}

function isValidLogLevel(level){
    return [
        LOG_LEVEL_DEBUG,
        LOG_LEVEL_ERROR,
        LOG_LEVEL_INFO,
        LOG_LEVEL_TRACE,
        LOG_LEVEL_WARN,
        LOG_LEVEL_OFF
    ].indexOf(level) > -1;
}

function isDev(){
    return process.env.NODE_ENV === NODE_ENV_DEVELOPMENT;
}

function isLoggerDisabled(){
    return isProd() || isLevelDisabled(LOGGER_NAMESPACE);
}

function isProd(){
    return process.env.NODE_ENV === NODE_ENV_PRODUCTION;
}

function isLevelDisabled(_ns){
    return false;
}


export function getLogger(namespace){
    if(wrappedInstances[namespace]){
        return wrappedInstances[namespace];
    }

    const logger = log4js.getLogger(namespace);

    if(!IS_LOGGER_NAMESPACE_DISABLED){
        //console.log('%s log level %s', namespace, logLevel);
    }

    const logError = function(...params){
        logger.error(...params);
    };

    const logWarn = function(...params){
        logger.warn(...params);
    };

    const logInfo = function(...params){
        logger.info(...params);
    };

    const log = logInfo;

    const logDebug = function(...params){
        logger.debug(...params);
    };

    const logTrace = function(...params){
        logger.trace(...params);
    };

    instances[namespace] = logger;

    wrappedInstances[namespace] = {
        logError,
        logWarn,
        logInfo,
        log,
        logDebug,
        logTrace
    };

    return instances[namespace];
}

export function setLogLevel(namespace, level){
    if(instances[namespace]){
        instances[namespace].level = level;
    }
}

export function getLogLevels(){
    return Object.assign({},...Object.keys(instances).map(
        ns =>{
            const res = {};

            res[ns] = instances[ns].level.levelStr;

            return res;
        }
    ));
}

export function loggerDecorator(name){
    return (target, prop) => {
        let val;
        Object.defineProperty(target, prop,{
            set:(factory)=>{
                console.log(name,{factory})
                val = factory(name)
            },
            get: () => val
        })
    }
}