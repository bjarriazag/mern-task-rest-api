const logger = require('../../util/logger')(module);

exports.createUser = (req, res) => {
  logger.info('createUser from user.controller ');
  res.send();
};
