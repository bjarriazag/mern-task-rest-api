const express = require('express');
const { check } = require('express-validator');
const projectController = require('../controllers/project.controller');
const { auth } = require('../util/imports');

// api/projects
const router = express.Router();

router.post(
  '/',
  auth,
  [check('name', 'Name is required').trim().not().isEmpty()],
  projectController.createProject
);

router.get('/', auth, projectController.getProjects);

router.put(
  '/:projectID',
  auth,
  [check('name', 'Name is required').trim().not().isEmpty()],
  projectController.updateProject
);

module.exports = router;
