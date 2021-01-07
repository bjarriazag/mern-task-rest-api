const { StatusCodes } = require('http-status-codes');
const { Response, ResponseData } = require('../util/imports');
const logger = require('../../util/logger')(module);
const User = require('../models/user.model');

exports.createUser = async (req, res) => {
  let user;
  const message = 'User created';
  try {
    user = new User(req.body);
    await user.save();
    res
      .status(StatusCodes.CREATED)
      .json(new Response(StatusCodes.CREATED, message, new ResponseData(user)));
    logger.success(`createUser - ${message}`);
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.BAD_REQUEST).json(new Response(StatusCodes.BAD_REQUEST, error));
  }
};
