// @flow
import type { ErrorType } from "universal/services/flow/notifications";

export const ERROR_THROW = "error/throw";
export const ERROR_COMMON_THROW = "error/common/throw";

export const throwCommonError = ({
  message,
  title,
  errorType,
  id,
}: ErrorType) => ({
  type: ERROR_COMMON_THROW,
  message,
  id,
  title,
  errorType,
});

export const throwError = ({
  message,
  code,
}: {
  message: string,
  code: string,
}) => ({
  type: ERROR_THROW,
  message,
  code,
});
