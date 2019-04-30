// @flow
import type { Element } from "react";
import type { CookiesType } from "universal/services/storage/cookies";
import { getCookie } from "universal/services/storage/cookies";
import { authTokensCookiesName } from "universal/services/constants/auth";

const R = require("ramda");

export const renderPageByUserAuth = ({
  cookies,
  ComponentAuthUser,
  ComponentNotAuthUser,
}: {
  cookies: CookiesType,
  ComponentAuthUser: Element<*>,
  ComponentNotAuthUser: Element<*>,
}) =>
  R.pipe(
    getCookie,
    R.ifElse(R.identity, () => ComponentAuthUser, () => ComponentNotAuthUser)
  )({
    cookies,
    cookieName: authTokensCookiesName,
  });
