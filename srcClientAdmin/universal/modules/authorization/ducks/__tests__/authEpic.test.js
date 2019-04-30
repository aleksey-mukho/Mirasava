import { of } from "rxjs";
import { push } from "react-router-redux";

import { expectEpic } from "testUtils/epics";
import authUtils from "universal/services/utils/auth";
import { authTokensCookiesName } from "universal/services/constants/auth";
import { ARTICLES_ROUTE } from "universal/routes/constants";
import * as epics from "../authEpic";
import * as actions from "../authActions";

jest.mock("react-router-redux");
jest.mock("universal/services/utils/auth");

describe("authEpic", () => {
  const TOKEN_ACCESS = "tokenAccess";
  const store = {};
  const tokens = {
    tokenAccess: TOKEN_ACCESS,
    tokenRefresh: "tokenRefresh",
  };
  const username = "username";
  const password = "password";

  authUtils.getStringifyAccessToken = jest.fn().mockReturnValue("tokenAccess");

  test("Save tokens in cookies, when authApi.fetchTokens answered", () => {
    const dependencies = {
      authApi: {
        fetchTokens: jest.fn().mockReturnValue(of(tokens)),
      },
      cookies: {
        set: jest.fn(),
      },
    };

    expectEpic(epics.authEpic, dependencies, store, {
      i: {
        t: "-c--c",
        a: {
          c: actions.sendAuthDates(username, password),
        },
      },
      o: {
        t: "-c--c",
        a: {
          c: push(ARTICLES_ROUTE),
        },
      },
    });

    expect(dependencies.authApi.fetchTokens).toHaveBeenCalledTimes(2);
    expect(dependencies.authApi.fetchTokens).toHaveBeenCalledWith(
      username,
      password
    );

    expect(authUtils.getStringifyAccessToken).toHaveBeenCalledTimes(2);
    expect(authUtils.getStringifyAccessToken).toHaveBeenCalledWith(
      TOKEN_ACCESS
    );

    expect(dependencies.cookies.set).toHaveBeenCalledTimes(2);
    expect(dependencies.cookies.set).toHaveBeenCalledWith(
      authTokensCookiesName,
      tokens
    );
  });
});
