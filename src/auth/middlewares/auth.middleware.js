const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { JWT_SECRET } = require('../util/imports');
const Response = require('../../util/api/response');
const logger = require('../../util/logger')(module);

module.exports = (req, res, next) => {
  // Read token
  const token = req.header('x-auth-token');
  // View token
  if (!token) {
    const message = 'No token provided';
    logger.fail(message);
    res.status(StatusCodes.UNAUTHORIZED).json(new Response(StatusCodes.UNAUTHORIZED, message));
  }
  // Validate token
  try {
    const tokenDecoded = jwt.verify(token, JWT_SECRET);
    req.user = tokenDecoded.user;
    next();
  } catch (error) {
    logger.error(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(new Response(StatusCodes.UNAUTHORIZED, 'Invalid token'));
  }
};
