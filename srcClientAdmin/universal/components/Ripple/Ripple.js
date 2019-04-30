// @flow
import * as React from "react";
import ReactDOM from "react-dom";
import styles from "universal/services/styles";

import s from "./Ripple.css";

const R = require("ramda");

type PropsType = {
  children: React.Node,
  className?: string,
};

type EventType = {
  clientX: number,
  clientY: number,
};

class Ripple extends React.PureComponent<PropsType> {
  calculateRipplePosition = ({
    event,
    parent,
    size,
  }: {
    event: EventType,
    parent: HTMLDivElement,
    size: number,
  }) =>
    R.compose(
      ({ left, top }) => ({
        x: event.clientX - left - size / 2,
        y: event.clientY - top - size / 2,
      }),
      () => parent.getBoundingClientRect()
    )();

  calculateRippleSize = ({ parent }: { parent: HTMLDivElement }) =>
    R.compose(
      R.ifElse(
        ({ offsetWidth, offsetHeight }) => R.lte(offsetHeight, offsetWidth),
        ({ offsetWidth }) => offsetWidth,
        ({ offsetHeight }) => offsetHeight
      ),
      R.pick(["offsetWidth", "offsetHeight"])
    )(parent);

  doTheRipple = (event: EventType) => {
    R.when(
      container => !!container,
      R.compose(
        rippleSize => {
          this.renderRipple({
            toNode: this.ripple,
            size: rippleSize,
            position: this.calculateRipplePosition({
              // $FlowFixMe
              event,
              parent: this.rippleContainer,
              size: rippleSize,
            }),
          });
        },
        // $FlowFixMe
        () => this.calculateRippleSize({ parent: this.rippleContainer })
      )
    )(this.rippleContainer);
  };

  ripple: HTMLDivElement | null;

  rippleContainer: HTMLDivElement | null;

  renderRipple = ({
    toNode,
    size,
    position,
  }: {
    toNode: HTMLDivElement | null,
    size: number,
    position: {
      x: number,
      y: number,
    },
  }) => {
    ReactDOM.unmountComponentAtNode(toNode);
    ReactDOM.render(
      <div
        style={{
          left: position.x,
          top: position.y,
          width: size,
          height: size,
        }}
        className={s.ripple}
      />,
      toNode
    );
  };

  render() {
    const { children, className: rippleContainerClassName } = this.props;

    return (
      <div
        {...this.props}
        role="presentation"
        ref={el => {
          this.rippleContainer = el;
        }}
        onClick={this.doTheRipple}
        className={styles([s.rippleContainer, rippleContainerClassName || ""])}>
        {children}
        <div
          ref={el => {
            this.ripple = el;
          }}
        />
      </div>
    );
  }
}

export default Ripple;
