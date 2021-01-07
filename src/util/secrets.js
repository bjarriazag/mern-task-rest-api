const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const logger = require('./logger')(module);

const ENV_DIRECTORY = path.join(__dirname, '..', 'config', 'environment.env');

if (fs.existsSync(ENV_DIRECTORY)) {
  logger.info('Using environment.env file to environment');
  dotenv.config({ path: ENV_DIRECTORY });
} else {
  logger.info('Using .env file to environment');
  dotenv.config({ path: '.env' });
}

exports.ENVIRONMENT = process.env.NODE_ENV;
exports.MONGODB_URI = process.env.MONGODB_URI;
