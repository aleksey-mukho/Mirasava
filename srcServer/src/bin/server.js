// @flow
const http = require('http');
const EventEmitter = require('events');
const mongoose = require('mongoose');
const app = require('../app/app');
const logger = require('../utils/logger');
const { SERVER_PORT } = require('../config/constants');
require('../config/MongoClient');

class Emitter extends EventEmitter {}

const emitter = new Emitter();
const server = http.createServer(app);

emitter.on('error', (err) => {
  logger.error('Unexpected error on emitter', err);
});

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException', err); // eslint-disable-line no-console
});

process.on('SIGTERM', () => {
  logger.info('Caught interrupt signal');
  server.close(() => {
    process.exit(1);
  });
  mongoose.connection.close(() => {
    logger.log('Mongoose default connection is disconnected due to application termination');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.log('Mongoose default connection is disconnected due to application termination');
    process.exit(0);
  });
});

server.listen(SERVER_PORT, (): void => logger.info(`Server run on port ${SERVER_PORT}`));
