import { of } from "rxjs";
import utils from "..";

const TOKEN_ACCESS = "TOKEN_ACCESS";
const TOKEN_REFRESH = "TOKEN_REFRESH";

const responce = {
  responce: "responce",
};
const config = {};
const body = {};
const cookies = {};

describe("api/utils/index.makeRequest", () => {
  utils.getTokensAndRequest = jest.fn(() => of(responce));
  utils.request = jest.fn(() => of(responce));
  utils.getTokensFromCookiesAndRequest = jest.fn(() => of(responce));
  test("getTokensAndRequest was called, when isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken returned true", done => {
    // utils.getTokens.mockClear();
    const isWithoutToken = false;
    utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken = jest
      .fn()
      .mockReturnValue(false);
    utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken = jest
      .fn()
      .mockReturnValue(true);
    utils
      .makeRequest({
        config,
        body,
        isWithoutToken,
        cookies,
      })
      .subscribe({
        next: resp => {
          expect(resp).toEqual(responce);
          expect(utils.getTokensFromCookiesAndRequest).not.toHaveBeenCalled();
          expect(utils.request).not.toHaveBeenCalled();
          expect(utils.getTokensAndRequest).toHaveBeenCalled();
          expect(utils.getTokensAndRequest).toHaveBeenCalledTimes(1);
          expect(utils.getTokensAndRequest).toHaveBeenCalledWith({
            cookies,
            config,
            body,
          });
        },
        complete: done,
      });
  });
  utils.getTokensFromCookiesAndRequest = jest.fn(() => of(responce));

  test("request was called, when isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken returned true", done => {
    const isWithoutToken = false;

    utils.getTokensAndRequest.mockClear();
    utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken.mockClear();
    utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken.mockClear();
    utils.tempStorage = {
      tokenAccess: TOKEN_ACCESS,
    };

    utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken = jest
      .fn()
      .mockReturnValue(true);
    utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken = jest
      .fn()
      .mockReturnValue(false);
    utils
      .makeRequest({
        config,
        body,
        isWithoutToken,
        cookies,
      })
      .subscribe({
        next: resp => {
          expect(resp).toEqual(responce);
          expect(utils.getTokensFromCookiesAndRequest).not.toHaveBeenCalled();
          expect(utils.getTokensAndRequest).not.toHaveBeenCalled();
          expect(utils.request).toHaveBeenCalled();
          expect(utils.request).toHaveBeenCalledTimes(1);
          expect(utils.request).toHaveBeenCalledWith({
            config,
            body,
            tokenAccess: TOKEN_ACCESS,
          });
        },
        complete: done,
      });
  });

  test("getTokensFromCookiesAndRequest was called, when isWithoutToken === false", done => {
    const isWithoutToken = false;

    utils.request.mockClear();
    utils.getTokensAndRequest.mockClear();
    utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken.mockClear();
    utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken.mockClear();
    utils.tempStorage = {
      tokenAccess: TOKEN_ACCESS,
    };

    utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken = jest
      .fn()
      .mockReturnValue(false);
    utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken = jest
      .fn()
      .mockReturnValue(false);
    utils
      .makeRequest({
        config,
        body,
        isWithoutToken,
        cookies,
      })
      .subscribe({
        next: resp => {
          expect(resp).toEqual(responce);
          expect(utils.getTokensAndRequest).not.toHaveBeenCalled();
          expect(utils.request).not.toHaveBeenCalled();
          expect(utils.getTokensFromCookiesAndRequest).toHaveBeenCalled();
          expect(utils.getTokensFromCookiesAndRequest).toHaveBeenCalledTimes(1);
          expect(utils.getTokensFromCookiesAndRequest).toHaveBeenCalledWith({
            config,
            body,
            cookies,
          });
        },
        complete: done,
      });
  });

  test("getTokensFromCookiesAndRequest was called, when isWithoutToken === true", done => {
    const isWithoutToken = true;

    utils.request.mockClear();
    utils.getTokensAndRequest.mockClear();
    utils.getTokensFromCookiesAndRequest.mockClear();
    utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken.mockClear();
    utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken.mockClear();

    utils.isHaveTempTokensAndAccessTokenNotExpiredAndNeedToken = jest
      .fn()
      .mockReturnValue(false);
    utils.isHaveTempRefreshTokenAndAccessTokenExpiredAndNeedToken = jest
      .fn()
      .mockReturnValue(false);
    utils
      .makeRequest({
        config,
        body,
        isWithoutToken,
        cookies,
      })
      .subscribe({
        next: resp => {
          expect(resp).toEqual(responce);
          expect(utils.getTokensAndRequest).not.toHaveBeenCalled();
          expect(utils.getTokensFromCookiesAndRequest).not.toHaveBeenCalled();
          expect(utils.request).toHaveBeenCalled();
          expect(utils.request).toHaveBeenCalledTimes(1);
          expect(utils.request).toHaveBeenCalledWith({ config, body });
        },
        complete: done,
      });
  });
});
