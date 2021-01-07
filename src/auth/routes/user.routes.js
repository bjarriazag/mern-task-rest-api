const express = require('express');
const logger = require('../../util/logger')(module);
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/', (req, res) => {
  logger.info('Hello from User Route');
  res.send();
});

router.post('/', userController.createUser);

module.exports = router;
