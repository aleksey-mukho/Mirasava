// @flow
export const SEND_AUTH_DATES = "/auth/send/dates";
export const SEND_AUTH_DATES_SUCCESS = "/auth/send/dates/success";
export const SAVE_AUTH_DATA = "/auth/save/data";

export const sendAuthDates = (username: string, password: string) => ({
  type: SEND_AUTH_DATES,
  username,
  password,
});

// export const sendAuthDatesSuccess = () => ({
//   type: SEND_AUTH_DATES_SUCCESS,
// });

// export const saveAuthData = (authTokens: {
//   tokenAccess: string,
//   tokenRefresh: string
// }) => ({
//   type: SAVE_AUTH_DATA,
//   authTokens,
// });
