const { StatusCodes } = require('http-status-codes');
const { Response, ResponseData } = require('../util/imports');
const logger = require('../../../util/logger')(module);
const Project = require('../models/project.model');

exports.createProject = async (req, res) => {
  const message = 'Project created';
  try {
    const project = new Project(req.body);
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
