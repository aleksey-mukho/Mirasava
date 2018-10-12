// @flow
import type { $Request, $Response } from 'express';

const tokenService = require('../service/tokenService');

export default (req: $Request, res: $Response, next: () => {}) => (
  tokenService
    .verifyAccessToken(req.headers['x-auth-token'])
    .then(() => {
      next();
    })
    .catch(err => (
      res.status(400).json({
        message: err.message,
      })
    ))
);
