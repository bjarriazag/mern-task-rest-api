const express = require('express');
const projectController = require('../controllers/project.controller');

// api/projects
const router = express.Router();

router.post('/', projectController.createProject);

module.exports = router;
