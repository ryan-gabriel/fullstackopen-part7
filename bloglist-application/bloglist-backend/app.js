const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

logger.info('connecting to ', config.MONGODB_URI);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      config.MONGODB_URI.replace('<password>', config.MONGODB_PASSWORD)
    );
    logger.info('connected to MongoDB');
  } catch (error) {
    logger.error('error connection to MongoDB:', error.message);
  }
};

connectToDatabase();

app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
