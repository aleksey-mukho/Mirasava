// @flow
export const QUERY = "articles/query";
export const QUERY_SUCCESS = "articles/query/success";

export const query = () => ({
  type: QUERY,
});

export const querySuccess = () => ({
  type: QUERY_SUCCESS,
});
