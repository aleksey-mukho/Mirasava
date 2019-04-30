// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import type { DispatchType } from "universal/services/flow/redux";

import * as articlesActions from "../ducks/articlesActions";

type PropsType = {
  query: () => {},
};

class ArticlesList extends Component<PropsType> {
  componentDidMount() {
    this.props.query();
  }

  render() {
    return [
      <h1 key="1">Admin Panel</h1>,
      <Link key="2" to="/login">
        Login
      </Link>,
    ];
  }
}

const mapDispatchToProps = (dispatch: DispatchType) => ({
  query: () => dispatch(articlesActions.query()),
});

export default connect(
  null,
  mapDispatchToProps
)(ArticlesList);
