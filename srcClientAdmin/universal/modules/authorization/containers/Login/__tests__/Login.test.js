import { Login } from '../Login';

describe('Login', () => {
  describe('handleChange', () => {
    test('Set property, when fieldName === username', () => {
      const login = new Login();
      const fieldName = 'username';
      const value = 'Ivan';

      login.handleChange(fieldName)(value);

      expect(login.username).toBe(value);
    });

    test('Set property, when fieldName === password', () => {
      const login = new Login();
      const fieldName = 'password';
      const value = '1234';

      login.handleChange(fieldName)(value);

      expect(login.password).toBe(value);
    });

    test('Don\'t property, when fieldName === password2', () => {
      const login = new Login();
      const fieldName = 'password2';
      const value = '1234';

      login.handleChange(fieldName)(value);

      expect(login.password2).toBe(undefined);
    });
  });
});
