import utils from "..";
import { of, throwError } from "rxjs";
import { authTokensCookiesName } from "../../../constants/auth";
// import { Observable, of } from 'rxjs';
// import { tempStorage } from '../utils';
// import { getStringifyAccessToken, getTimeExpires } from '../../utils/auth';

jest.unmock("../../../storage/cookies");
jest.unmock("../../../utils/auth");

const storage = require.requireActual("../../../storage/cookies");
const auth = require.requireActual("../../../utils/auth");
describe("api/utils", () => {
  const TOKEN_ACCESS = "TOKEN_ACCESS";
  const TOKEN_REFRESH = "TOKEN_REFRESH";

  const accessTokens = {
    tokenAccess: TOKEN_ACCESS,
    tokenRefresh: TOKEN_REFRESH,
  };

  describe("writeToTempStorage", () => {
    test("Save auth tokens and time expires when call", () => {
      const date = Date.now();
      utils.tempStorage = {};
      const stringifyAccessToken = `{"token":"${TOKEN_ACCESS}","timeExpires":${date}}`;
      auth.getStringifyAccessToken = jest
        .fn()
        .mockReturnValue(stringifyAccessToken);
      auth.getTimeExpires = jest.fn().mockReturnValue(date);

      utils.writeToTempStorage({
        tokenAccess: TOKEN_ACCESS,
        tokenRefresh: TOKEN_REFRESH,
      });

      expect(utils.tempStorage).toEqual({
        tokenAccess: stringifyAccessToken,
        tokenRefresh: TOKEN_REFRESH,
        timeExpires: date,
      });
    });
  });

  describe("isAccessTokenExpired", () => {
    test("Return true, when Date.now() > timeExpires", () => {
      expect(utils.isAccessTokenExpired(Date.now() - 200)).toBe(true);
    });

    test("Return false, when Date.now() < timeExpires", () => {
      expect(utils.isAccessTokenExpired(Date.now() + 200)).toBe(false);
    });
  });

  describe("isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken", () => {
    const timeExpires = Date.now();
    describe("tempStorage have tokenRefresh", () => {
      utils.tempStorage = {
        tokenRefresh: TOKEN_REFRESH,
        timeExpires,
      };

      test("Return false, when isWithoutToken = true", () => {
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
        const isWithoutToken = true;
        expect(
          utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(false);
      });

      test("Return true, when isWithoutToken = false and token expired", () => {
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
        const isWithoutToken = false;
        expect(
          utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(true);
      });

      test("Return false, when isWithoutToken = false and token not expired", () => {
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(false);
        const isWithoutToken = false;
        expect(
          utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(false);
      });
    });

    describe("tempStorage haven't tokenRefresh", () => {
      utils.tempStorage = {
        timeExpires,
      };

      test("Return false, when tempStorage haven't tokenRefresh", () => {
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
        const isWithoutToken = true;
        expect(
          utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(false);
      });
    });
  });

  describe("isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken", () => {
    const timeExpires = Date.now();
    describe("tempStorage have tokens", () => {
      utils.tempStorage = {
        tokenRefresh: TOKEN_REFRESH,
        tokenAccess: TOKEN_ACCESS,
        timeExpires,
      };

      test("Return false, when isWithoutToken = true and accessToken expired", () => {
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
        const isWithoutToken = true;
        expect(
          utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(false);
      });

      test("Return false, when isWithoutToken = false and accessToken expired", () => {
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
        const isWithoutToken = false;
        expect(
          utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(false);
      });

      test("Return true, when isWithoutToken = false and accessToken not expired", () => {
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(false);
        const isWithoutToken = false;
        expect(
          utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(true);
      });
    });

    describe("tempStorage haven't tokenRefresh", () => {
      test("Return false, when access token expired", () => {
        utils.tempStorage = {
          timeExpires,
          tokenAccess: TOKEN_ACCESS,
        };
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
        const isWithoutToken = false;
        expect(
          utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(false);
      });

      test("Return false, when access token not expired", () => {
        utils.tempStorage = {
          timeExpires,
          tokenAccess: TOKEN_ACCESS,
        };
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
        const isWithoutToken = false;
        expect(
          utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(false);
      });
    });

    describe("tempStorage haven't tokenAccess", () => {
      test("Return false, when access token expired", () => {
        utils.tempStorage = {
          timeExpires,
          tokenRefresh: TOKEN_REFRESH,
        };
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
        const isWithoutToken = false;
        expect(
          utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(false);
      });

      test("Return false, when access token not expired", () => {
        utils.tempStorage = {
          timeExpires,
          tokenRefresh: TOKEN_REFRESH,
        };
        utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
        const isWithoutToken = false;
        expect(
          utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken(
            isWithoutToken
          )
        ).toBe(false);
      });
    });
  });

  describe("getTokensAndRequest", () => {
    const cookies = {};
    const config = {};
    const body = {};
    utils.tempStorage.tokenRefresh = TOKEN_REFRESH;
    utils.getTokens = jest.fn(() => of({ tokenAccess: TOKEN_ACCESS }));
    utils.request = jest.fn(() => of(accessTokens));

    test("return accessTokens, when we get tokens", done => {
      utils.getTokensAndRequest({ cookies, config, body }).subscribe({
        next: responce => {
          expect(responce).toEqual(accessTokens);
          expect(utils.getTokens).toHaveBeenCalled();
          expect(utils.request).toHaveBeenCalled();
          expect(utils.getTokens).toHaveBeenCalledTimes(1);
          expect(utils.request).toHaveBeenCalledTimes(1);
          expect(utils.getTokens).toHaveBeenCalledWith({
            cookies,
            tokenRefresh: TOKEN_REFRESH,
          });
          expect(utils.request).toHaveBeenCalledWith({
            config,
            body,
            tokenAccess: TOKEN_ACCESS,
          });
        },
        complete: done,
      });
    });
  });

  describe("getTokensDependingExpire", () => {
    const timeExpires = Date.now();
    const cookies = {};

    test("Call getTokens when token expired", done => {
      utils.getTokens.mockClear();
      utils.getTokens = jest.fn().mockImplementation(() => of("token"));
      utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
      utils
        .getTokensDependingExpire({
          tokenAccess: TOKEN_ACCESS,
          tokenRefresh: TOKEN_REFRESH,
          timeExpires,
          cookies,
        })
        .subscribe({
          next: accessToken => {
            expect(accessToken).toBe("token");
            expect(utils.getTokens).toHaveBeenCalled();
            expect(utils.getTokens).toHaveBeenCalledTimes(1);
            expect(utils.getTokens).toHaveBeenCalledWith({
              cookies,
              tokenRefresh: TOKEN_REFRESH,
            });
          },
          complete: done,
        });
    });

    test("return accessToken when token not expired", done => {
      utils.isAccessTokenExpired = jest.fn().mockReturnValue(false);
      utils
        .getTokensDependingExpire({
          tokenAccess: TOKEN_ACCESS,
          tokenRefresh: TOKEN_REFRESH,
          timeExpires,
          cookies,
        })
        .subscribe({
          next: accessToken => {
            expect(accessToken).toEqual({ tokenAccess: TOKEN_ACCESS });
          },
          complete: done,
        });
    });
  });

  describe("getAccessToken", () => {
    const cookies = {};

    test("Call getTokens when accessToken === undefined", done => {
      utils.getTokens.mockClear();
      utils.getTokens = jest
        .fn()
        .mockImplementation(() => of({ tokenAccess: TOKEN_ACCESS }));
      utils.isAccessTokenExpired = jest.fn().mockReturnValue(true);
      utils
        .getAccessToken({
          tokenAccess: undefined,
          tokenRefresh: TOKEN_REFRESH,
          cookies,
        })
        .subscribe({
          next: accessToken => {
            expect(accessToken).toBe(TOKEN_ACCESS);
            expect(utils.getTokens).toHaveBeenCalled();
            expect(utils.getTokens).toHaveBeenCalledTimes(1);
            expect(utils.getTokens).toHaveBeenCalledWith({
              cookies,
              tokenRefresh: TOKEN_REFRESH,
            });
          },
          complete: done,
        });
    });

    test("return accessToken when accessToken !== undefined", done => {
      utils
        .getAccessToken({
          tokenAccess: TOKEN_ACCESS,
          tokenRefresh: TOKEN_REFRESH,
          cookies,
        })
        .subscribe({
          next: accessToken => {
            expect(accessToken).toEqual(TOKEN_ACCESS);
          },
          complete: done,
        });
    });
  });

  describe("getTokensFromCookiesAndRequest", () => {
    test("Call functions when have been called getTokensFromCookiesAndRequest", done => {
      const cookies = {};
      const config = {};
      const body = {};
      const responce = {
        responce: "responce",
      };
      storage.getCookie = jest.fn(() => ({
        tokenAccess: TOKEN_ACCESS,
        tokenRefresh: TOKEN_REFRESH,
      }));
      utils.getCorrectAccessToken = jest.fn(() => () =>
        of({
          tokenAccess: TOKEN_ACCESS,
        })
      );
      utils.request = jest.fn(() => of(responce));
      utils
        .getTokensFromCookiesAndRequest({
          config,
          body,
          cookies,
        })
        .subscribe({
          next: resp => {
            expect(resp).toBe(responce);
            expect(storage.getCookie).toHaveBeenCalled();
            expect(storage.getCookie).toHaveBeenCalledTimes(1);
            expect(storage.getCookie).toHaveBeenCalledWith({
              cookies,
              cookieName: authTokensCookiesName,
            });
            expect(utils.request).toHaveBeenCalled();
            expect(utils.request).toHaveBeenCalledTimes(1);
            expect(utils.request).toHaveBeenCalledWith({
              config,
              body,
              tokenAccess: TOKEN_ACCESS,
            });
            expect(utils.getCorrectAccessToken).toHaveBeenCalled();
            expect(utils.getCorrectAccessToken).toHaveBeenCalledTimes(1);
            expect(utils.getCorrectAccessToken).toHaveBeenCalledWith(cookies);
          },
          complete: done,
        });
    });
  });

  describe("ajax", () => {
    const responce = {
      responce: "responce",
    };
    const config = {};
    const cookies = {};
    const body = {};

    test("Get responce, when makeRequest do request", done => {
      utils.makeRequest = jest.fn(() => of(responce));
      utils
        .ajax(cookies)({
          config,
          body,
        })
        .subscribe({
          next: resp => {
            expect(responce).toEqual(resp);
            expect(utils.makeRequest).toHaveBeenCalled();
            expect(utils.makeRequest).toHaveBeenCalledTimes(1);
            expect(utils.makeRequest).toHaveBeenCalledWith({
              config,
              body,
              isWithoutToken: false,
              cookies,
            });
          },
          complete: done,
        });
    });

    test("Catch error, when makeRequest return error", done => {
      utils.makeRequest = jest.fn(() => throwError(responce));
      utils
        .ajax(cookies)({
          config,
          body,
        })
        .subscribe({
          error: resp => {
            expect(responce).toEqual(resp);
            expect(utils.makeRequest).toHaveBeenCalled();
            expect(utils.makeRequest).toHaveBeenCalledTimes(1);
            expect(utils.makeRequest).toHaveBeenCalledWith({
              config,
              body,
              isWithoutToken: false,
              cookies,
            });
            done();
          },
        });
    });
  });
});
