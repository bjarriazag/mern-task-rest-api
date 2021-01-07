const logger = require('./util/logger')(module);

// Environments
const PORT = process.env.PORT || 4000;

const start = async (app) => {
  app.listen(PORT, () => {
    logger.info('Server is running...');
    logger.info(`Listening on port ${PORT}`);
  });
};

module.exports = start;
