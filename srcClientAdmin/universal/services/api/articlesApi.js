// @flow
import { Observable } from 'rxjs';

import type { AjaxType } from './utils';

const QUERY = 'query';

export default (ajax: AjaxType => Observable<mixed>) => ({
  query: () => (
    ajax({
      config: {
        url: QUERY,
        method: 'GET',
      },
    })
  ),
});
