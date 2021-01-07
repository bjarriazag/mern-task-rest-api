const express = require('express');
const connectDB = require('./config/db');
const { logger } = require('./util/logger');
// Create server
const app = express();
// Functions
connectDB();
// Environments
const PORT = process.env.PORT || 4000;

// Page
app.get('/', (req, res) => {
  res.send('[NODE] Server is running...');
});

const start = async () => {
  app.listen(PORT, () => {
    logger.info('Server is running...');
    logger.info(`Listening on port ${PORT}`);
  });
};

start();
