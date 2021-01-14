const express = require('express');
const { check } = require('express-validator');
const taskController = require('../controllers/task.controller');
const { auth } = require('../util/imports');

// api/tasks
const router = express.Router();

router.post(
  '/',
  auth,
  [check('name', 'Name is required').trim().not().isEmpty()],
  [check('projectID', 'Project is required').trim().not().isEmpty()],
  taskController.createTask
);

router.get('/', auth, taskController.getTasks);

module.exports = router;
