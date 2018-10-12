// @flow
import { expiresInAccess } from '../constants/auth';

const R = require('ramda');

export default {
  getTimeExpires: () => Date.now() + expiresInAccess,

  getStringifyAccessToken(accessToken: string) {
    return R.ifElse(
      R.isNil,
      () => { throw new Error('accessToken is empty'); },
      () => JSON.stringify({
        token: accessToken,
        timeExpires: this.getTimeExpires(),
      }),
    )(accessToken);
  },
};
