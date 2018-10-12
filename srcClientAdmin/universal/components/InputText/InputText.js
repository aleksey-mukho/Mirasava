// @flow
import React, { PureComponent } from 'react';

import { s4 } from 'universal/services/utils/generateId';

import InputTextUI from './InputTextUI';

type InputValueType = string;

type PropsType = {
  type?: string,
  classNames?: Array<string>,
  onChange: (value: string) => void,
  label: string
};

type StateType = {
  inputValue: InputValueType
};

class InputText extends PureComponent<PropsType, StateType> {
  static defaultProps = {
    type: 'text',
    classNames: [],
  }

  inputId = s4()

  state = {
    inputValue: '',
  }

  handleChange = ({ target: { value } }: {
    target: {
      value: InputValueType
    }
  }) => {
    this.setState({
      inputValue: value,
    });

    this.props.onChange(value);
  }

  render() {
    const { inputValue } = this.state;
    const { type, label, classNames } = this.props;

    return (
      <InputTextUI
        inputValue={inputValue}
        classNames={classNames}
        type={type}
        inputId={this.inputId}
        handleChange={this.handleChange}
        label={label}
      />
    );
  }
}

InputText.defaultProps = {
  type: 'text',
  classNames: [],
};

export default InputText;
