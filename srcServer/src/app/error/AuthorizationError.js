// @flow
class AuthorizationError extends Error {
  constructor({
    message, code, status,
  }: {
    message?: string, status?: number, code: string
  }) {
    super(message);

    this.code = code;
    this.name = 'AuthorizationError';
    this.status = status || 401;

    Error.captureStackTrace(this, this.constructor);
  }

  code: string
  status: number
}
module.exports = AuthorizationError;
