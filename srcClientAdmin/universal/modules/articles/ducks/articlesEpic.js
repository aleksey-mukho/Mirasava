// @flow
import { ofType } from 'redux-observable';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import type { ActionType, StoreType } from 'universal/services/flow/epics';
import * as articlesActions from './articlesActions';

export const articlesEpic = (
  action$: ActionType, store: StoreType, { articlesApi }: {
    articlesApi: {
      query: () => Observable<void>
    }
  },
) => (
  action$.pipe(
    ofType(articlesActions.QUERY),
    switchMap(() => (
      articlesApi.query()
        .pipe(
          map(() => articlesActions.querySuccess()),
          catchError(err => of(console.error({ err }))), // eslint-disable-line no-console
        )
    )),
  )
);

export default articlesEpic;
