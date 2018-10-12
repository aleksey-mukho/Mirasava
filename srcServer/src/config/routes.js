// @flow
const authController = require('../app/controller/authController');
const authMiddleware = require('../app/middleware/authMiddleware').default;
const { ENDPOINT } = require('./constants');
// $FlowFixMe
module.exports = (app) => {
  app.post(`${ENDPOINT}/auth/login`, authController.login);
  app.post(`${ENDPOINT}/auth/registration`, authController.registration);
  app.get(`${ENDPOINT}/auth/get-tokens/:tokenRefresh`, authController.getTokens);
  // TODO: remove
  app.get(`${ENDPOINT}/query`, authMiddleware, authController.query);
};
