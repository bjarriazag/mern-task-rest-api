const express = require('express');
const { logger } = require('../util/logger');

const router = express.Router();

router.get('/', (req, res) => {
  logger.info('Hello from User Route');
  res.send();
});

module.exports = router;
