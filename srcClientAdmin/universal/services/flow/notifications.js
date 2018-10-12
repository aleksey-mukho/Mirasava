// @flow
export type ErrorType = {
  id: string,
  title: string,
  message: string,
  errorType: 'error' | 'warning' | 'info'
};
