import { expectEpic } from 'testUtils/epics';

import { notificationType } from 'universal/services/constants/notifications';
import * as errorActions from 'universal/redux/actions/errorActions';
import * as errorsEpics from '../errorsEpic';

const utilsId = require('universal/services/utils/generateId');

describe('errorsEpics', () => {
  utilsId.s4 = jest.fn(() => 1);
  describe('chooseAction', () => {
    test('Call throwCommonError, when code === undefined', () => {
      const error = {
        message: 'message',
        code: 'PERM-202',
      };
      errorActions.throwCommonError = jest.fn();

      errorsEpics.chooseAction(error);

      expect(errorActions.throwCommonError).toHaveBeenCalledTimes(1);
      expect(errorActions.throwCommonError).toHaveBeenCalledWith({
        message: error.message,
        errorType: notificationType.error,
        id: 1,
        title: 'Error',
      });
    });

    test('Call throwCommonError, when code !== undefined', () => {
      const error = {
        message: 'message',
        code: 'PERM-202',
      };
      errorActions.throwCommonError = jest.fn();

      errorsEpics.chooseAction(error);

      expect(errorActions.throwCommonError).toHaveBeenCalledTimes(1);
      expect(errorActions.throwCommonError).toHaveBeenCalledWith({
        message: error.message,
        errorType: notificationType.error,
        id: 1,
        title: 'Error',
      });
    });
  });

  describe('errorInterceptionEpic', () => {
    test('Return querySuccess action, when articlesApi.query answered', () => {
      errorActions.throwCommonError = jest.fn();

      const messageError = {
        message: 'error',
        code: 'PERM-201',
      };

      expectEpic(
        errorsEpics.errorInterceptionEpic,
        null,
        null,
        {
          i: {
            t: '-b--b',
            a: {
              b: errorActions.throwError(messageError),
            },
          },
          o: {
            t: '-c--c',
            a: {
              c: errorActions.throwCommonError(),
            },
          },
        },
      );

      expect(errorActions.throwCommonError).toHaveBeenCalledTimes(3);
      expect(errorActions.throwCommonError).toHaveBeenCalledWith({
        message: messageError.message,
        errorType: notificationType.error,
        id: 1,
        title: 'Error',
      });
    });
  });
});
