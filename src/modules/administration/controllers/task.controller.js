const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { Response, ResponseData } = require('../util/imports');
const logger = require('../../../util/logger')(module);
const Project = require('../models/project.model');
const Task = require('../models/task.model');

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

exports.createTask = async (req, res) => {
  const message = 'Task created';
  try {
    // Validations
    const resultValidation = await validations(req, res);
    if (resultValidation) {
      return resultValidation;
    }
    // Get project
    const { projectID } = req.body;
    const project = await Project.findById(projectID);
    if (!project) {
      logger.fail(`createTask - No project found with ID ${projectID}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new Response(StatusCodes.NOT_FOUND, 'No project found'));
    }
    // Verify owner
    if (project.owner.toString() !== req.user.id) {
      logger.fail(`createTask - No project ${projectID} related to user ${req.user.id}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new Response(StatusCodes.NOT_FOUND, 'Project not exist'));
    }
    // Create
    const task = new Task(req.body);
    await task.save();
    logger.success(`createTask - ${message}`);
    return res
      .status(StatusCodes.CREATED)
      .json(new Response(StatusCodes.CREATED, message, new ResponseData(project)));
  } catch (error) {
    logger.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new Response(StatusCodes.INTERNAL_SERVER_ERROR, "Can't create task"));
  }
};
