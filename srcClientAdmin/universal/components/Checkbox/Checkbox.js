// @flow
import React, { PureComponent } from "react";
import ReactDOM from "react-dom";

import { s4 } from "universal/services/utils/generateId";

import CheckboxUI from "./CheckboxUI";
import s from "./Checkbox.css";

type CheckboxValueType = boolean;

type PropsType = {
  label: string,
  classNames: Array<string>,
};

type StateType = {
  checkboxValue: CheckboxValueType,
};

export default class Checkbox extends PureComponent<PropsType, StateType> {
  checkboxId = s4();

  ripple = null;

  state = {
    checkboxValue: true,
  };

  componentDidMount() {}

  handleChange = () => {
    this.setState(prevState => ({
      checkboxValue: !prevState.checkboxValue,
    }));

    this.renderRipple();
  };

  setRippleRef = (el: HTMLDivElement | null) => {
    this.ripple = el;
  };

  renderRipple = () => {
    ReactDOM.unmountComponentAtNode(this.ripple);
    ReactDOM.render(<div className={s.rippleAnimated} />, this.ripple);
  };

  render() {
    const { checkboxValue } = this.state;
    const { label, classNames } = this.props;

    return (
      <CheckboxUI
        setRippleRef={this.setRippleRef}
        handleChange={this.handleChange}
        classNames={classNames}
        checkboxValue={checkboxValue}
        checkboxId={this.checkboxId}
        label={label}
      />
    );
  }
}
