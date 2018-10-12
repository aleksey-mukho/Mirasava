// @flow
const jwt = require('jsonwebtoken');
const { SECRET_SOKET_TOKEN } = require('../../config/constants');
const { promisify } = require('../../utils/index');

const tokenService = {
  getToken: (nickname: string): Promise<{}> => (
    new Promise((resolve): void => (
      resolve(promisify(jwt.sign)({
        dateCreated: Date.now(),
        nickname,
      }, SECRET_SOKET_TOKEN))
    ))
  ),

};

module.exports = tokenService;
