// @flow
class TokenError extends Error {
  constructor(message?: string, status?: number) {
    super(message);

    this.name = 'TokenError';
    this.status = status || 401;

    Error.captureStackTrace(this, this.constructor);
  }

  status: number
}

module.exports = TokenError;
