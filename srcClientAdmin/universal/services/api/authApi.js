// @flow
import { Observable } from 'rxjs';
// import { ajax } from './utils';

import type { AjaxType } from './utils';

const EP_GET_AUTH_TOKENS = 'auth/login';

export default (ajax: AjaxType => Observable<mixed>) => ({
  fetchTokens: (username: string, password: string) => (
    ajax({
      config: {
        url: EP_GET_AUTH_TOKENS,
        method: 'POST',
      },
      body: {
        username,
        password,
      },
      isWithoutToken: true,
    })
  ),
});
