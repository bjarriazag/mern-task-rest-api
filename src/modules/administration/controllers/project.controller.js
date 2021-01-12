const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { Response, ResponseData, MESSAGES } = require('../util/imports');
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

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ owner: -1 });
    logger.success(`getProjects - listed projects`);
    return res
      .status(StatusCodes.OK)
      .json(new Response(StatusCodes.OK, MESSAGES.SUCCESS, new ResponseData(projects)));
  } catch (error) {
    logger.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new Response(StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

exports.updateProject = async (req, res) => {
  try {
    // Validations
    const resultValidation = await validations(req, res);
    if (resultValidation) {
      return resultValidation;
    }
    // Update
    // Get ID
    const { projectID } = req.params;
    let project = await Project.findById(projectID);
    if (!project) {
      logger.fail(`updateProject - No project found with ID ${projectID}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new Response(StatusCodes.NOT_FOUND, 'No project found'));
    }
    // Verify owner
    if (project.owner.toString() !== req.user.id) {
      logger.fail(`updateProject - No project related to user ${projectID}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new Response(StatusCodes.NOT_FOUND, 'Project not exist'));
    }
    // Data
    const { name } = req.body;
    const newProject = {};
    if (name) {
      newProject.name = name;
    }
    project = await Project.findOneAndUpdate(
      { _id: projectID },
      { $set: newProject },
      { new: true }
    );
    logger.success(`updateProject - Updated project`, newProject);
    return res
      .status(StatusCodes.OK)
      .json(new Response(StatusCodes.OK, MESSAGES.SUCCESS, new ResponseData(project)));
  } catch (error) {
    logger.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new Response(StatusCodes.INTERNAL_SERVER_ERROR, 'No project found'));
  }
};
