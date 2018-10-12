// @flow
export const TOKEN_REFRESH = 'tokenRefresh';
export const TOKEN_ACCESS = 'tokenAccess';

export type CookiesType = {
  set: (cookieName: string, cookieValue: string | Object) => void,
  get: (cookieName: string) => Object
};

export const setCookie = ({
  cookies, cookieName, cookieValue,
}: {
  cookies: CookiesType,
  cookieName: string,
  cookieValue: string | {}
 }) => (
  cookies.set(cookieName, cookieValue)
);

export const getCookie = ({ cookies, cookieName }: {
  cookies: CookiesType, cookieName: string
}) => (
  cookies.get(cookieName)
);
