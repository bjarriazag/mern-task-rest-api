const logger = require('../../util/logger')(module);

exports.healthCheck = (req, res) => {
  logger.info('Hello from User Route');
  res.send();
};

exports.createUser = (req, res) => {
  logger.info('createUser from user.controller ', req.body);
  res.send();
};
