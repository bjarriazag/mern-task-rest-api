const { StatusCodes } = require('http-status-codes');
const bcryptjs = require('bcryptjs');
const { Response, ResponseData } = require('../util/imports');
const logger = require('../../util/logger')(module);
const User = require('../models/user.model');

// Functions
const validationsUser = async (data, res) => {
  let validationError;
  const { email } = data;
  const user = await User.findOne({ email });
  if (user) {
    validationError = 'User already exists';
    logger.fail(validationError);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new Response(StatusCodes.BAD_REQUEST, validationError));
  }
  return null;
};

// Controllers
exports.createUser = async (req, res) => {
  let user;
  const message = 'User created';
  try {
    const validationResult = await validationsUser(req.body, res);
    if (validationResult) {
      return validationResult;
    }
    // Create user
    user = new User(req.body);
    // Secret password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);
    // Save user
    await user.save();
    logger.success(`createUser - ${message}`);
    return res
      .status(StatusCodes.CREATED)
      .json(new Response(StatusCodes.CREATED, message, new ResponseData(user)));
  } catch (error) {
    logger.error(error);
    return res.status(StatusCodes.BAD_REQUEST).json(new Response(StatusCodes.BAD_REQUEST, error));
  }
};
