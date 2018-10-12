import * as errorActions from 'universal/redux/actions/errorActions';
import * as notificationsReducer from '../notificationsReducer';

describe('errorsReducer', () => {
  describe('ERROR_COMMON_THROW', () => {
    test('Add new error, when type === ERROR_COMMON_THROW', () => {
      const message = 'message';
      const error = {
        message,
        type: 'error',
        id: 'id',
        title: 'title',
      };
      const action = {
        type: errorActions.ERROR_COMMON_THROW,
        message: error.message,
        errorType: error.type,
        id: error.id,
        title: error.title,
      };

      expect(notificationsReducer.reducer(undefined, action))
        .toEqual([error]);
    });
  });

  describe('default value', () => {
    test('Return default state, when type does not fit', () => {
      const state = {
        errors: [],
      };
      const action = {
        type: 'type',
      };

      expect(notificationsReducer.reducer(state, action))
        .toEqual(state);
    });
  });
});
