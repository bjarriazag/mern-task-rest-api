const mongoose = require('mongoose');
const { MONGODB_URI } = require('../util/secrets');
const { logger, errorHandler } = require('../util/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    logger.success('Database connected');
  } catch (error) {
    errorHandler(new Error(error));
  }
};

module.exports = connectDB;
