// @flow
const path = require('path');

const variables = process.env;
export const ENV: string = variables.NODE_ENV || 'development';

const pathEnvFiles = {
  production: '.env-prod',
  development: '.env-dev',
  localhost: '.env-localhost',
  test: '.env-tests',
};

require('dotenv').config({ path: pathEnvFiles[ENV] });

export const SERVER_PORT: string = variables.PORT || '3005';
export const ENDPOINT: string = variables.ENDPOINT || '/v1';

export const LOG_LEVEL = variables.LOG_LEVEL || 'info';

export const ROOT_PATH: string = path.join(__dirname, '../../..');

export const SECRET_SOKET_TOKEN: ?string = variables.SECRET_SOKET_TOKEN;
