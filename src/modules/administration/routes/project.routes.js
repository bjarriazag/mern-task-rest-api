const express = require('express');
const projectController = require('../controllers/project.controller');
const { auth } = require('../util/imports');

// api/projects
const router = express.Router();

router.post('/', auth, projectController.createProject);

router.get('/', auth, projectController.createProject);

module.exports = router;
