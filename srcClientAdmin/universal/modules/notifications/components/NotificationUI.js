// @flow
import React, { PureComponent } from "react";

import clearIcon from "universal/assets/icons/clear.svg";
import errorOutlineIcon from "universal/assets/icons/errorOutline.svg";
import { notificationType } from "universal/services/constants/notifications";
import type { ErrorType } from "universal/services/flow/notifications";
import styles from "universal/services/styles";

import s from "./NotificationUI.css";

const R = require("ramda");

type PropsType = {
  ...ErrorType,
  id: string,
  closeNotification: (id: string) => {},
  idClosedNotification?: string,
};

export const selectIcon = R.cond([
  [R.equals(notificationType.error), () => errorOutlineIcon],
  [R.T, () => errorOutlineIcon],
]);

class NotificationUI extends PureComponent<PropsType> {
  animateIsClosed = R.when(R.equals(this.props.id), R.always(s.animateClosed));

  render() {
    const {
      errorType,
      title,
      message,
      id,
      closeNotification,
      idClosedNotification,
    } = this.props;

    return (
      <div
        className={styles([
          s.container,
          this.animateIsClosed(idClosedNotification),
        ])}>
        <img src={selectIcon(errorType)} alt="" />
        <div className={s.textBlock}>
          <span className={s.title}>{title}</span>
          <span className={s.description}>{message}</span>
        </div>
        <button
          onClick={closeNotification(id)}
          type="button"
          className={s.closeButton}>
          <img src={clearIcon} alt="Close Button" />
        </button>
      </div>
    );
  }
}

export default NotificationUI;
