const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { Response, ResponseData } = require('../util/imports');
const logger = require('../../util/logger')(module);
const User = require('../models/user.model');
const { cryptHasher } = require('../util/crypto');

// Functions
const validationsUser = async (req, res) => {
  // Route validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.fail('Route validations', errors);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new Response(StatusCodes.BAD_REQUEST, errors.array()));
  }
  // Own validations
  let validationError;
  const { email } = req.body;
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
    // Validations
    const resultValidation = await validationsUser(req, res);
    if (resultValidation) {
      return resultValidation;
    }
    // Create user
    user = new User(req.body);
    // Secret password
    user.password = await cryptHasher(user.password);
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
