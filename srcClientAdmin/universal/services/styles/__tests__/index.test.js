import { stylesJoin } from '../index';

describe('styles utils', () => (
  describe('stylesJoin', () => {
    test('Return concatenated strings, when call with array', () => {
      const st1 = 'styles1';
      const st2 = 'styles2';

      expect(stylesJoin([st1, st2])).toBe(`${st1} ${st2}`);
    });
  })
));
