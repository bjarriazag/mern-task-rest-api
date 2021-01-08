const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { Response, ResponseData } = require('../util/imports');
const logger = require('../../util/logger')(module);
const User = require('../models/user.model');
const { cryptCompare, generateToken } = require('../util/crypto');

// Functions
const validations = async (req, res, user) => {
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
  const { password } = req.body;
  // Exist user
  if (!user) {
    validationError = 'User not exists';
    logger.fail(validationError);
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(new Response(StatusCodes.NOT_FOUND, validationError));
  }
  // Valid password
  const valPassword = await cryptCompare(password, user.password);
  if (!valPassword) {
    validationError = 'Invalid password';
    logger.fail(validationError);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new Response(StatusCodes.BAD_REQUEST, validationError));
  }
  // No errors
  return null;
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Validations
    const resultValidation = await validations(req, res, user);
    if (resultValidation) {
      return resultValidation;
    }
    // Login success
    logger.success(`login - Login success: user ${email}`);
    const { name } = user;
    // Token
    const payload = {
      user: {
        id: user._id,
        name,
        email,
      },
    };
    const token = await generateToken(payload);
    // Response
    return res
      .status(StatusCodes.OK)
      .json(new Response(StatusCodes.OK, 'Login success', new ResponseData({ token })));
  } catch (error) {
    logger.error(error);
    return res.status(StatusCodes.BAD_REQUEST).json(new Response(StatusCodes.BAD_REQUEST, error));
  }
};
