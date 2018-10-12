// @flow
import type { $Request, $Response } from 'express';

const {
  getPasswordHash,
  createUser,
  checkPassword,
} = require('../service/authService');
const tokenService = require('../service/tokenService');

type ReqType = {
  ...$Request,
  body: {
    password: string,
    username: string
  }
};

module.exports = {
  registration: (req: ReqType, res: $Response, next: () => {}): Promise<{}> => (
    getPasswordHash(req.body.password)
      .then(passwordHash => (
        createUser(req.body.username, passwordHash)
      ))
      .then(tokens => (
        res.status(200).json({
          ...tokens,
        })
      ))
      .catch(next)
  ),


  login: (req: ReqType, res: $Response, next: () => {}) => (
    checkPassword(req.body.username, req.body.password)
      .then(() => tokenService.getAccessTokens(req.body.username))
      .then(tokens => (
        res.status(200).json({
          ...tokens,
        })
      ))
      .catch(next)
  ),

  getTokens: (req: $Request, res: $Response, next: () => {}): Promise<{}> => (
    tokenService.verifyRefreshToken(req.params.tokenRefresh)
      .then(tokens => (
        res.status(200).json({
          ...tokens,
        })
      ))
      .catch(next)
  ),
  // eslint-disable-next-line no-unused-vars
  query: (req: $Request, res: $Response, next: () => {}): $Response => (
    res.status(200).json({
      responce: 'OK',
    })
  ),
};
