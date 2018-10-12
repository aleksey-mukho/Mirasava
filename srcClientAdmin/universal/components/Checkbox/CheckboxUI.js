// @flow
import React from 'react';
import styles from 'universal/services/styles';

import s from './Checkbox.css';

const R = require('ramda');

const addActiveClass = checkboxValue => (
  R.ifElse(
    R.equals(true),
    R.always(s.checkboxActive),
    R.always(''),
  )(checkboxValue)
);

export default ({
  handleChange,
  setRippleRef,
  classNames,
  checkboxValue,
  checkboxId,
  label,
}: {
  handleChange: () => void,
  setRippleRef: (el: HTMLDivElement | null) => void,
  classNames: Array<string>,
  checkboxValue: boolean,
  checkboxId: string,
  label: string
}) => (
  <div className={styles([s.wrapper, ...classNames])}>
    <label
      htmlFor={checkboxId}
      className={s.label}
    >
      <input
        className={[s.nativeInput]}
        type="checkbox"
        id={checkboxId}
        onChange={handleChange}
        defaultChecked={checkboxValue}
      />
      <div className={styles([s.customCheckbox, addActiveClass(checkboxValue)])}>
        <div
          role="presentation"
          className={s.ripple}
        />
        <div
          className={s.rippleAnimatedWrapper}
          ref={setRippleRef}
        />
      </div>
      {label}
    </label>
  </div>
);
