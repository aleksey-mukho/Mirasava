// @flow
class CustomError extends Error {
  constructor(message?: string, status?: number) {
    super(message);

    this.name = 'CustomError';
    this.status = status || 500;

    Error.captureStackTrace(this, this.constructor);
  }

  status: number
}

module.exports = CustomError;
