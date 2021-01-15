const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const { Response, ResponseData } = require('../util/imports');
const logger = require('../../../util/logger')(module);
const Project = require('../models/project.model');
const Task = require('../models/task.model');

// Functions
const validations = async (req, res, projectID, project) => {
  // Route validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.fail('Route validations', errors);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(new Response(StatusCodes.BAD_REQUEST, errors.array()));
  }
  // Own validations
  // Get project
  if (!project) {
    logger.fail(`tasks - No project found with ID ${projectID}`);
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(new Response(StatusCodes.NOT_FOUND, 'No project found'));
  }
  // Verify owner
  if (project.owner.toString() !== req.user.id) {
    logger.fail(`tasks - No project ${projectID} related to user ${req.user.id}`);
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(new Response(StatusCodes.NOT_FOUND, 'Project not exist'));
  }
  return null;
};

exports.createTask = async (req, res) => {
  const message = 'Task created';
  try {
    // Get project
    const { projectID } = req.body;
    const project = await Project.findById(projectID);
    // Validations
    const resultValidation = await validations(req, res, projectID, project);
    if (resultValidation) {
      return resultValidation;
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

exports.getTasks = async (req, res) => {
  const message = 'Task listed';
  try {
    // Get project
    const { projectID } = req.body;
    const project = await Project.findById(projectID);
    // Validations
    const resultValidation = await validations(req, res, projectID, project);
    if (resultValidation) {
      return resultValidation;
    }
    // Get tasks by project
    const tasks = await Task.find({ projectID });
    logger.success(`getTasks - ${message}`);
    return res
      .status(StatusCodes.CREATED)
      .json(new Response(StatusCodes.CREATED, message, new ResponseData(tasks)));
  } catch (error) {
    logger.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new Response(StatusCodes.INTERNAL_SERVER_ERROR, "Can't list tasks"));
  }
};

exports.updateTask = async (req, res) => {
  const message = 'Task updated';
  try {
    const { taskID } = req.params;
    // Get project
    const { projectID, name, status } = req.body;
    const project = await Project.findById(projectID);
    // Validations
    const resultValidation = await validations(req, res, projectID, project);
    if (resultValidation) {
      return resultValidation;
    }
    // Update task
    const newTask = {};
    if (name) {
      newTask.name = name;
    }
    if (status) {
      newTask.status = status;
    }
    // Get tasks by project
    let task = await Task.findById(taskID);
    if (!task) {
      logger.fail(`updateTask - No task found with ID ${taskID}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new Response(StatusCodes.NOT_FOUND, 'No task found'));
    }
    // Update
    task = await Task.findOneAndUpdate({ _id: taskID }, newTask, { new: true });
    logger.success(`updateTask - ${message}`);
    return res
      .status(StatusCodes.OK)
      .json(new Response(StatusCodes.OK, message, new ResponseData(task)));
  } catch (error) {
    logger.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new Response(StatusCodes.INTERNAL_SERVER_ERROR, "Can't update task"));
  }
};
