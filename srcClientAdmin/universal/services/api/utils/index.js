// @flow
import { Observable, of } from "rxjs";
import {
  // $FlowFixMe
  mergeMap,
  tap,
  map,
  pluck,
} from "rxjs/operators";

import AjaxSubscriber from "./AjaxSubscriber";
import type { CookiesType } from "../../storage/cookies";
import {
  getCookie,
  setCookie,
  TOKEN_REFRESH,
  TOKEN_ACCESS,
} from "../../storage/cookies";
import { authTokensCookiesName } from "../../constants/auth";
import authUtils from "../../utils/auth";

const R = require("ramda");

type ConfigType = {
  url: string,
  contentType?: string,
  method: string,
};

export type AjaxType = {
  config: ConfigType,
  body?: {},
  isWithoutToken?: boolean,
};

// only for test
// eslint-disable-next-line import/no-mutable-exports
// export let tempStorage: {
//   tokenRefresh?: string,
//   tokenAccess?: string,
//   timeExpires: number
// } = {
//   timeExpires: 0,
// };
type CredentialsType = {
  tokenAccess: string,
  tokenRefresh: string,
};

export default {
  tempStorage: {
    timeExpires: 0,
  },

  writeToTempStorage({ tokenAccess, tokenRefresh }: CredentialsType) {
    this.tempStorage = {
      tokenAccess: authUtils.getStringifyAccessToken(tokenAccess),
      tokenRefresh,
      timeExpires: authUtils.getTimeExpires(),
    };
  },

  request: ({
    config,
    body,
    tokenAccess,
  }: {
    config: {
      url: string,
      method: string,
    },
    body?: Object,
    tokenAccess?: string,
  }): Observable<*> =>
    Observable.create(
      observer =>
        new AjaxSubscriber({
          observer,
          config,
          body,
          tokenAccess,
        })
    ),

  getTokens({
    cookies,
    tokenRefresh,
  }: {
    cookies: CookiesType,
    tokenRefresh: string,
  }) {
    return this.request({
      config: {
        url: `auth/get-tokens/${tokenRefresh}`,
        method: "GET",
      },
      body: {
        token: tokenRefresh,
        body: 0,
      },
      tokenRefresh,
    }).pipe(
      tap((authTokens: { tokenAccess: string, tokenRefresh: string }) =>
        setCookie({
          cookies,
          cookieName: authTokensCookiesName,
          cookieValue: authTokens,
        })
      ),
      tap(this.writeToTempStorage)
    );
  },

  isAccessTokenExpired: (timeExpires: number) => Date.now() > timeExpires,

  isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken(
    isWithoutToken: boolean
  ) {
    return (
      R.has(TOKEN_REFRESH, this.tempStorage) &&
      R.not(R.isNil(this.tempStorage.tokenRefresh)) &&
      R.not(isWithoutToken) &&
      this.isAccessTokenExpired(this.tempStorage.timeExpires)
    );
  },

  isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken(
    isWithoutToken: boolean
  ) {
    return (
      R.has(TOKEN_REFRESH, this.tempStorage) &&
      R.has(TOKEN_ACCESS, this.tempStorage) &&
      R.not(R.isNil(this.tempStorage.tokenAccess)) &&
      R.not(isWithoutToken) &&
      R.not(this.isAccessTokenExpired(this.tempStorage.timeExpires))
    );
  },

  getTokensAndRequest({
    cookies,
    config,
    body,
  }: {
    cookies: CookiesType,
    config: ConfigType,
    body?: Object,
  }) {
    return this.getTokens({
      cookies,
      tokenRefresh: this.tempStorage.tokenRefresh,
    }).pipe(
      mergeMap(({ tokenAccess }) => this.request({ config, body, tokenAccess }))
    );
  },

  getTokensDependingExpire({
    tokenAccess,
    timeExpires,
    cookies,
    tokenRefresh,
  }: {
    tokenAccess: string,
    tokenRefresh: string,
    timeExpires: number,
    cookies: CookiesType,
  }) {
    return R.ifElse(
      this.isAccessTokenExpired,
      () => this.getTokens({ cookies, tokenRefresh }),
      () => of({ tokenAccess })
    )(timeExpires);
  },

  getAccessToken({
    tokenAccess,
    tokenRefresh,
    cookies,
  }: {
    tokenAccess: string,
    tokenRefresh: string,
    cookies: CookiesType,
  }) {
    return R.ifElse(
      R.isNil,
      () =>
        this.getTokens({ cookies, tokenRefresh }).pipe(pluck("tokenAccess")),
      () => of(tokenAccess)
    )(tokenAccess);
  },

  getCorrectAccessToken(cookies: CookiesType) {
    return ({
      tokenAccess,
      tokenRefresh,
    }: {
      tokenAccess: string,
      tokenRefresh: string,
    }) =>
      this.getAccessToken({ tokenAccess, tokenRefresh, cookies }).pipe(
        map(token => JSON.parse(token)),
        mergeMap(({ token, timeExpires }) =>
          this.getTokensDependingExpire({
            tokenAccess: token,
            tokenRefresh,
            timeExpires,
            cookies,
          })
        )
      );
  },

  getTokensFromCookiesAndRequest({
    config,
    body,
    cookies,
  }: {
    cookies: CookiesType,
    config: ConfigType,
    body?: Object,
  }) {
    return of(getCookie({ cookies, cookieName: authTokensCookiesName })).pipe(
      mergeMap(this.getCorrectAccessToken(cookies)),
      mergeMap(({ tokenAccess }) => this.request({ config, body, tokenAccess }))
    );
  },

  makeRequest({
    config,
    body,
    isWithoutToken,
    cookies,
  }: {
    cookies: CookiesType,
    config: ConfigType,
    body?: Object,
    isWithoutToken: boolean,
  }) {
    return R.cond([
      [
        () =>
          this.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken(
            isWithoutToken
          ),
        () => this.getTokensAndRequest({ cookies, config, body }),
      ],
      [
        () =>
          this.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken(
            isWithoutToken
          ),
        () =>
          this.request({
            config,
            body,
            tokenAccess: this.tempStorage.tokenAccess,
          }),
      ],
      [
        R.not,
        () => this.getTokensFromCookiesAndRequest({ config, body, cookies }),
      ],
      [R.T, () => this.request({ config, body })],
    ])(isWithoutToken);
  },

  ajax(cookies: CookiesType) {
    return ({ config, body, isWithoutToken = false }: AjaxType) =>
      Observable.create(observer =>
        this.makeRequest({
          config,
          body,
          isWithoutToken,
          cookies,
        }).subscribe(
          res => {
            observer.next(res);
            observer.complete();
          },
          err => {
            observer.error(err);
          }
        )
      );
  },
};
