const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { Response, ResponseData } = require('../util/imports');
const logger = require('../../../util/logger')(module);
const Project = require('../models/project.model');

// Functions
const validations = async (req, res) => {
  // Route validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.fail('Route validations', errors);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new Response(StatusCodes.BAD_REQUEST, errors.array()));
  }
  // Own validations
  return null;
};

exports.createProject = async (req, res) => {
  const message = 'Project created';
  try {
    // Validations
    const resultValidation = await validations(req, res);
    if (resultValidation) {
      return resultValidation;
    }
    // Create
    const project = new Project(req.body);
    project.owner = req.user.id;
    await project.save();
    logger.success(`createProject - ${message}`);
    return res
      .status(StatusCodes.CREATED)
      .json(new Response(StatusCodes.CREATED, message, new ResponseData(project)));
  } catch (error) {
    logger.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new Response(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};
