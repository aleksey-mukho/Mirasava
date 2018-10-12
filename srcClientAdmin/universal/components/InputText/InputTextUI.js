// @flow
import React from 'react';

import styles from 'universal/services/styles';

import s from './InputText.css';

const R = require('ramda');

export const addClassIsValueNotEmpty = (inputValue: string) => (
  R.when(
    R.compose(R.not, R.isEmpty),
    R.always(s.inputHaveValue),
  )(inputValue)
);

export const addClassIsValueLengthGt3 = (inputValue: string) => (
  R.when(
    R.compose(R.lt(3), R.length),
    R.always(s.validateOk),
  )(inputValue)
);

export default ({
  inputValue,
  classNames,
  type,
  inputId,
  handleChange,
  label,
}: {
  inputValue: string,
  classNames?: Array<string>,
  type?: string,
  inputId: string,
  handleChange: (event: {
    target: {
      value: string
    }
  }) => void,
  label: string
}) => (
  <div
    className={styles([
      // $FlowFixMe
      s.wrapper, addClassIsValueNotEmpty(inputValue), ...classNames,
    ])}
  >
    <input
      autoComplete="new-password"
      className={s.input}
      type={type}
      id={inputId}
      onChange={handleChange}
      value={inputValue}
    />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label
      htmlFor={inputId}
      className={s.label}
    >
      {label}
    </label>
    <div className={styles([s.ok, addClassIsValueLengthGt3(inputValue)])} />
    <div className={s.bar} />
  </div>
);
