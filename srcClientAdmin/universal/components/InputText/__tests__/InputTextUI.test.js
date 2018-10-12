import * as inputTextUI from '../InputTextUI';

describe('InputText', () => {
  describe('addClassIsValueNotEmpty', () => {
    test('Add CSS class inputHaveValue, when this.state.inputValue not Empty', () => {
      const inputValue = 'value';
      const cssClass = inputTextUI.addClassIsValueNotEmpty(inputValue);
      expect(cssClass).toBe('inputHaveValue');
    });

    test('Don\'t add CSS class inputHaveValue, when this.state.inputValue Empty', () => {
      const inputValue = '';
      const cssClass = inputTextUI.addClassIsValueNotEmpty(inputValue);
      expect(cssClass).toBe('');
    });
  });

  describe('addClassIsValueLengthGt3', () => {
    test('Add CSS class validateOk, when this.state.inputValue.length > 3', () => {
      const inputValue = 'value';
      const cssClass = inputTextUI.addClassIsValueLengthGt3(inputValue);
      expect(cssClass).toBe('validateOk');
    });

    test('Don\'t add CSS class validateOk, when this.state.inputValue.length < 3', () => {
      const inputValue = '';
      const cssClass = inputTextUI.addClassIsValueLengthGt3(inputValue);
      expect(cssClass).toBe('');
    });
  });
});
