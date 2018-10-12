// @flow
import * as errorActions from 'universal/redux/actions/errorActions';
import type { ErrorType } from 'universal/services/flow/notifications';
import * as notificationsActions from './notificationsActions';

type ActionType = {
  type: string,
  ...ErrorType
};

type StateType = Array<{
  ...ErrorType
}>;

export const reducer = (state: StateType = [], action: ActionType) => {
  switch (action.type) {
    case errorActions.ERROR_COMMON_THROW: {
      const errorsState = [...state];
      errorsState.push({
        message: action.message,
        type: action.errorType,
        id: action.id,
        title: action.title,
      });

      return errorsState;
    }

    case notificationsActions.NOTIFICATION_CLOSE:
      return state.filter(({ id }) => id !== action.id);

    default:
      return state;
  }
};

export default reducer;
