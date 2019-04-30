// @flow
import React from "react";
import Ripple from "universal/components/Ripple";

import type { EventType } from "universal/services/flow/events";

import s from "./Button.css";

const Button = ({
  type,
  clickHandler,
  value,
  icon,
}: {
  icon?: string,
  clickHandler?: (event: EventType) => void,
  type: string,
  value: string,
}) => (
  <Ripple>
    <button type={type} className={s.button} onClick={clickHandler}>
      {icon && <img className={s.image} src={icon} alt="" />}
      <span className={s.buttonText}>{value}</span>
    </button>
  </Ripple>
);

export default Button;
