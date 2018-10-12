// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import type { ErrorType } from 'universal/services/flow/notifications';
import NotificationUI from '../components/NotificationUI';
import * as notificationsAction from '../ducks/notificationsActions';
import s from './Notifications.css';

type PropsType = {
  errors: Array<ErrorType>,
  closeNotification: (id: string) => {}
};

type StateType = {
  idClosedNotification?: string
};

class Notifications extends PureComponent<PropsType, StateType> {
  state = {
    idClosedNotification: undefined,
  }

  closeNotification = (id: string) => () => {
    this.setState({
      idClosedNotification: id,
    });
    // For css animation close container
    setTimeout(() => this.props.closeNotification(id), 300);
  }

  render() {
    const { errors } = this.props;
    const { idClosedNotification } = this.state;

    return (
      errors.length ? (
        <div className={s.wrapper}>
          {errors.map(({
            id, title, message, errorType,
          }) => (
            <NotificationUI
              key={id}
              id={id}
              title={title}
              message={message}
              errorType={errorType}
              closeNotification={this.closeNotification}
              idClosedNotification={idClosedNotification}
            />
          ))}
        </div>
      ) : null
    );
  }
}

const mapDispatchToProps = (dispatch: (action: {}) => {}) => ({
  closeNotification: (id: string) => (
    dispatch(
      notificationsAction.closeNotification(id),
    )
  ),
});

const mapStateToProps = ({ errors }) => ({
  errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
