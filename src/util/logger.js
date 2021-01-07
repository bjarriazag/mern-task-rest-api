const { format, transports, createLogger } = require('winston');
const path = require('path');

const { combine, timestamp, printf } = format;

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
  return `${timestampLog} ${logLevel[level]} : ${path.basename(__filename)} - ${message}`;
});
// LOG options
const LOG_DIRECTORY = path.join(__dirname, '..', '..', 'logs', 'logger.log');
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
  logger.info('Logging initialized');
}

// Handle error Exception
const errorHandler = (error) => {
  const keyLogTrace = new Date().getTime();
  logger.error(`key:${keyLogTrace} - ${error.message}`);
  logger.trace(`key:${keyLogTrace} - ${error.stack}`);
};

exports.logger = logger;
exports.errorHandler = errorHandler;
