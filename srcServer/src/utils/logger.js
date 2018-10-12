// @flow
const winston = require('winston');
const { ENV, LOG_LEVEL } = require('../config/constants');

const rewriters = [
  (level, msg, meta): {} => ({
    ...meta,
    env: ENV,
    timeStamp: new Date(),
  }),
];

const transports = [
  new winston.transports.Console({
    colorize: true,
  }),
];

const logger = new (winston.Logger)({
  rewriters,
  transports,
  level: LOG_LEVEL,
});

module.exports = logger;
