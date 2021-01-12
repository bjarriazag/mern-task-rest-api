const Response = require('../../util/api/response');
const ResponseData = require('../../util/api/response-data');
const MESSAGES = require('../../util/api/messages');
const { JWT_SECRET } = require('../../util/secrets');

module.exports = {
  Response,
  ResponseData,
  JWT_SECRET,
  VALIDATIONS: MESSAGES.VALIDATIONS.AUTH,
};
