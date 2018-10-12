// @flow
const jwt = require('jsonwebtoken');
const {
  SECRET_TOKEN,
  TIME_EXPIRES_ACCESS_TOKEN,
  TIME_EXPIRES_REFRESH_TOKEN,
} = require('../../config/constants/auth');
const TokenError = require('../error/TokenError');

const tokenService = {
  // TODO add Observable, now sync action
  getTokenAccess: (tokenInfo: {}) => jwt.sign({
    ...tokenInfo,
    tokenType: 'access',
  }, SECRET_TOKEN, {
    expiresIn: TIME_EXPIRES_ACCESS_TOKEN,
  }),
  // TODO add Observable, now sync action
  getTokenRefresh: (tokenInfo: {}) => jwt.sign({
    ...tokenInfo,
    tokenType: 'refresh',
  }, SECRET_TOKEN, {
    expiresIn: TIME_EXPIRES_REFRESH_TOKEN,
  }),

  getAccessTokens(nickname: string) {
    const tokenInfo = {
      date: Date.now(),
      nickname,
    };

    return {
      tokenAccess: this.getTokenAccess(tokenInfo),
      tokenRefresh: this.getTokenRefresh(tokenInfo),
    };
  },

  verifyRefreshToken(refreshToken: string): Promise<{
    tokenAccess: string,
    tokenRefresh: string
  } | TokenError> {
    // TODO: add Observable
    return new Promise((resolve, reject) => {
      const decoded = jwt.verify(refreshToken, SECRET_TOKEN);
      if (Object.prototype.hasOwnProperty.call(decoded, 'nickname')) {
        return resolve({
          ...this.getAccessTokens(decoded.nickname),
        });
      }

      return reject({ message: 'broken token' });
    })
      .catch((err) => {
        throw new TokenError(err.message);
      });
  },

  verifyAccessToken: (tokenAccess: string): Promise<void
  | TokenError> => (
    // TODO: add Observable
    new Promise((resolve, reject) => {
      const decoded = jwt.verify(tokenAccess, SECRET_TOKEN);
      if (Object.prototype.hasOwnProperty.call(decoded, 'nickname')) {
        return resolve();
      }

      return reject({ message: 'broken token' });
    })
      .catch((err) => {
        throw new TokenError(err.message);
      })
  ),
};

module.exports = tokenService;
