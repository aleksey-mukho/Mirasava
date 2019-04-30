import { of } from "rxjs";

import utils from "..";

import { authTokensCookiesName } from "../../../constants/auth";

jest.unmock("../../../storage/cookies");

const storage = require.requireActual("../../../storage/cookies");

const TOKEN_ACCESS = "TOKEN_ACCESS";
const TOKEN_REFRESH = "TOKEN_REFRESH";

describe("api/utils/index.getTokens", () => {
  describe("getTokens", () => {
    const authTokens = {
      tokenAccess: TOKEN_ACCESS,
      tokenRefresh: TOKEN_REFRESH,
    };
    const cookies = {};

    utils.request = jest.fn().mockImplementation(() => of(authTokens));
    utils.writeToTempStorage = jest.fn();
    storage.setCookie = jest.fn();

    test("request called with parameters when test called getTokens", done => {
      utils
        .getTokens({
          cookies,
          tokenRefresh: TOKEN_REFRESH,
        })
        .subscribe({
          next: () => {
            expect(utils.request).toHaveBeenCalled();
            expect(utils.request).toHaveBeenCalledWith({
              config: {
                url: `auth/get-tokens/${authTokens.tokenRefresh}`,
                method: "GET",
              },
              body: {
                token: authTokens.tokenRefresh,
                body: 0,
              },
              tokenRefresh: authTokens.tokenRefresh,
            });
            expect(utils.request).toHaveBeenCalledTimes(1);
          },
          complete: done,
        });
    });

    test("writeToTempStorage called when test called getTokens", done => {
      storage.setCookie.mockClear();
      utils
        .getTokens({
          cookies: {},
          tokenRefresh: TOKEN_REFRESH,
        })
        .subscribe({
          next: () => {
            expect(storage.setCookie).toHaveBeenCalledTimes(1);
            expect(storage.setCookie).toHaveBeenCalled();
            expect(storage.setCookie).toHaveBeenCalledWith({
              cookies,
              cookieName: authTokensCookiesName,
              cookieValue: authTokens,
            });
          },
          complete: done,
        });
    });
  });

  describe("getCorrectAccessToken", () => {
    const timeExpires = Date.now();
    const cookies = {};

    test("Return correct accessToken", done => {
      utils.getAccessToken = jest.fn(() =>
        of(
          JSON.stringify({
            token: TOKEN_ACCESS,
            timeExpires,
          })
        )
      );
      utils.getTokensDependingExpire = jest.fn(() =>
        of({ tokenAccess: TOKEN_ACCESS })
      );
      utils
        .getCorrectAccessToken(cookies)({
          tokenAccess: TOKEN_ACCESS,
          tokenRefresh: TOKEN_REFRESH,
        })
        .subscribe({
          next: accessToken => {
            expect(accessToken).toEqual({ tokenAccess: TOKEN_ACCESS });
            expect(utils.getAccessToken).toHaveBeenCalled();
            expect(utils.getAccessToken).toHaveBeenCalledTimes(1);
            expect(utils.getAccessToken).toHaveBeenCalledWith({
              cookies,
              tokenRefresh: TOKEN_REFRESH,
              tokenAccess: TOKEN_ACCESS,
            });
            expect(utils.getTokensDependingExpire).toHaveBeenCalled();
            expect(utils.getTokensDependingExpire).toHaveBeenCalledTimes(1);
            expect(utils.getTokensDependingExpire).toHaveBeenCalledWith({
              timeExpires,
              cookies,
              tokenRefresh: TOKEN_REFRESH,
              tokenAccess: TOKEN_ACCESS,
            });
          },
          complete: done,
        });
    });
  });
});
