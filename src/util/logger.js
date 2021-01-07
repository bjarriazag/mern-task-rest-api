const { format, transports, createLogger } = require('winston');

const path = require('path');

const { combine, timestamp, printf } = format;

// Functions
const getDateFormat = (date) => {
  const year = date.getFullYear();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const resultDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
  return resultDate;
};

// Custom LOG levels
const customLevels = {
  levels: {
    error: 0,
    trace: 0,
    warn: 1,
    fail: 1,
    info: 2,
    success: 2,
    debug: 5,
  },
};
// LOG format
const logFormat = printf((parameters) => {
  const { level, message } = parameters;
  const timestampLog = parameters.timestamp;
  const logLevel = {
    info: '[   INFO   ]',
    fail: '[   FAIL   ]',
    debug: '[   DEBUG  ]',
    trace: '[   TRACE  ]',
    error: '[   ERROR  ]',
    success: '[  SUCCESS ]',
    warn: '[ WARNNING ]',
  };
  return `${timestampLog} ${logLevel[level]} : ${message}`;
});
// LOG Name
const today = new Date();
const hours = today.getHours() <= 12 ? `${today.getHours()}:00-AM` : `${today.getHours()}:00-PM`;
const LOG_NAME = `${getDateFormat(today)}/log-${getDateFormat(today)}-${hours}.log`;
const LOG_DIRECTORY = path.join(__dirname, '..', '..', 'logs', LOG_NAME);
// LOG options
const options = {
  levels: customLevels.levels,
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    }),
    new transports.File({ filename: LOG_DIRECTORY, level: 'debug' }),
  ],
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    logFormat
  ),
};

const logger = createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.info(`[ ${path.basename(__filename)} ] - Logging initialized`);
}

// Message logger
const printLog = (filename, msg, vars) => {
  return `[ ${filename} ] - ${msg} ${vars ? JSON.stringify(vars) : ''}`;
};

module.exports = (module) => {
  const filename = path.basename(module.id);
  return {
    info: (msg, vars) => {
      logger.info(printLog(filename, msg, vars));
    },
    success: (msg, vars) => {
      logger.success(printLog(filename, msg, vars));
    },
    error: (_error, vars) => {
      const error = _error instanceof Error ? _error : new Error(_error);
      const keyLogTrace = new Date().getTime();
      logger.error(printLog(filename, `key:${keyLogTrace} - ${error.message}`, vars));
      logger.trace(printLog(filename, `key:${keyLogTrace} - ${error.stack}`, vars));
    },
    warn: (msg, vars) => {
      logger.warn(printLog(filename, msg, vars));
    },
    fail: (msg, vars) => {
      logger.fail(printLog(filename, msg, vars));
    },
    debug: (msg, vars) => {
      logger.debug(printLog(filename, msg, vars));
    },
  };
};
