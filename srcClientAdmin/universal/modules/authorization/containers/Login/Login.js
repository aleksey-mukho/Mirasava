// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import LoginUI from '../../components/LoginUI';
import * as authActions from '../../ducks/authActions';

const R = require('ramda');

type PropsType = {
  sendAuthDates: (username: string, password: string) => {}
};

export class Login extends PureComponent<PropsType> {
  onSubmit = (e: {
    preventDefault: () => void
  }) => {
    e.preventDefault();

    return this.props.sendAuthDates(this.username, this.password);
  }

  handleChange = (fieldName: string) => (
    (value: string) => {
      R.when(
        () => R.or(R.equals('username', fieldName), R.equals('password', fieldName)),
        () => {
          // $FlowFixMe
          this[fieldName] = value;
        },
      )(fieldName);
    }
  )

  username: string

  password: string

  render() {
    return (
      <LoginUI
        handleChange={this.handleChange}
        onSubmit={this.onSubmit}
      />
    );
  }
}

const mapDispatchToProps = (dispatch: (action: {}) => {}) => ({
  sendAuthDates: (username: string, password: string) => (
    dispatch(authActions.sendAuthDates(username, password))
  ),
});

export default connect(
  null,
  mapDispatchToProps,
)(Login);
