// @flow
import * as authActions from './authActions';

const initialState = {
  isAuthSuccess: false,
};

type ActionType = {
  type: string
};

type StateType = {
  isAuthSuccess: boolean
};

const reducer = (state: StateType = initialState, action: ActionType) => {
  switch (action.type) {
    // case authActions.SEND_AUTH_DATES_SUCCESS: {
    //   return {
    //     ...state,
    //     isAuthSuccess: true,
    //   };
    // }

    default:
      return state;
  }
};

export default reducer;
