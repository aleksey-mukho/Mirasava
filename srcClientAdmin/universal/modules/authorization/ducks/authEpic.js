// @flow
import { ofType } from 'redux-observable';

import { push } from 'react-router-redux';
import {
  switchMap, catchError, tap,
} from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import type { ActionType, StoreType } from 'universal/services/flow/epics';
import utilsAuth from 'universal/services/utils/auth';
import type { CookiesType } from 'universal/services/storage/cookies';
import { authTokensCookiesName } from 'universal/services/constants/auth';
import { ARTICLES_ROUTE } from 'universal/routes/constants';
import * as errorActions from 'universal/redux/actions/errorActions';

import * as authActions from './authActions';

type AuthActionsType = {
  username: string,
  password: string
};

export const authEpic = (
  action$: ActionType, store: StoreType, { authApi, cookies }: {
    authApi: {
      fetchTokens: (username: string, password: string) => Observable<{
        tokenAccess: string,
        tokenRefresh: string
      }>
    },
    cookies: CookiesType
  },
) => (
  action$.pipe(
    ofType(authActions.SEND_AUTH_DATES),
    switchMap(({ username, password }: AuthActionsType) => (
      authApi.fetchTokens(username, password)
        .pipe(
          tap(({ tokenAccess, tokenRefresh }) => {
            cookies.set(authTokensCookiesName, {
              tokenAccess: utilsAuth.getStringifyAccessToken(tokenAccess),
              tokenRefresh,
            });
          }),
          switchMap(() => of(push(ARTICLES_ROUTE))),
          catchError(err => of(errorActions.throwError(err))),
        )
    )),
  )
);

export default authEpic;
