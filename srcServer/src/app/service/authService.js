// @flow
const bcrypt = require('bcrypt');
const User = require('../model/User');
const AuthenticationError = require('../error/AuthenticationError');
const tokenService = require('./tokenService');

const saltRounds = 10;
module.exports = {
  getPasswordHash: (password: string): Promise<string> => (
    bcrypt.hash(password, saltRounds)
  ),

  checkPassword: (
    nickname: string, userTypedPassword: string,
  ): Promise<boolean | Error> => (
    User.findOne({ nickname })
      .then(({ passwordHash }) => (
        bcrypt.compare(userTypedPassword, passwordHash)
          .then((isCompared) => {
            if (isCompared) {
              return true;
            }
            throw new AuthenticationError({
              message: 'Password not valid',
              code: 'AUTH-1',
            });
          })
      ))
      .catch(() => {
        throw new AuthenticationError({
          message: 'You typed broken password',
          code: 'AUTH-2',
        });
      })
  ),

  createUser: (nickname: string, passwordHash: string): Promise<{
    tokenAccess: string,
    tokenRefresh: string
  }> => (
    User.create({
      nickname,
      passwordHash,
    })
      .then(() => ({
        ...tokenService.getAccessTokens(nickname),
      }))
  ),
};
