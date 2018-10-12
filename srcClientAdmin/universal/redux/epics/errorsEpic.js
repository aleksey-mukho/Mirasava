// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';

import type { ActionType } from 'universal/services/flow/epics';
import * as errorActions from 'universal/redux/actions/errorActions';
import { notificationType } from 'universal/services/constants/notifications';
import { s4 } from 'universal/services/utils/generateId';

import type { ErrorType } from 'universal/services/flow/notifications';

const R = require('ramda');

export const chooseAction = ({
  message,
  code,
}: {
  ...ErrorType,
  message: string,
  code: string
}) => (
  R.cond([
    [R.isNil, () => errorActions.throwCommonError({
      message,
      errorType: notificationType.error,
      id: s4(),
      title: 'Error',
    })],
    [codeErr => R.test(/^AUTH-/, codeErr), () => errorActions.throwCommonError({
      message,
      errorType: notificationType.error,
      id: s4(),
      title: 'Error Authorization',
    })],
    [R.T, () => errorActions.throwCommonError({
      message,
      errorType: notificationType.error,
      id: s4(),
      title: 'Error',
    })],
  ])(code)
);

export const errorInterceptionEpic = (
  action$: ActionType,
) => (
  action$.pipe(
    ofType(errorActions.ERROR_THROW),
    map(error => (
      chooseAction(error)
    )),
  )
);

export default errorInterceptionEpic;
