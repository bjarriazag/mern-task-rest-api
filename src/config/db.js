const mongoose = require('mongoose');
const { MONGODB_URI } = require('../util/secrets');
const logger = require('../util/logger')(module);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    logger.success('Database connected');
  } catch (error) {
    logger.error(new Error(error));
  }
};

module.exports = connectDB;
