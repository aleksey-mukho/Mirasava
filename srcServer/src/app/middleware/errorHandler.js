// @flow
const logger = require('../../utils/logger');

// eslint-disable-next-line no-unused-vars
module.exports = () => (
  error: any,
  req: express$Request, res: express$Response,
  next?: express$NextFunction, // eslint-disable-line no-unused-vars
) => {
  logger.error({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });

  const errorHandler = {
    AuthenticationError: () => (
      res
        .status(error.status)
        .json({
          message: error.message,
          code: error.code,
        })
    ),
  };

  const unhandledError = () => (
    res
      .status(500)
      .json({
        message: error.message,
        code: 'SERVER-500',
      })
  );

  const serverAnswer = error.name &&
    Object.prototype.hasOwnProperty.call(errorHandler, error.name) ?
    errorHandler[error.name] : unhandledError;

  return serverAnswer();
};

