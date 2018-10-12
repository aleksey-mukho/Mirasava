// @flow
import type { ComponentType } from 'react';
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import 'universal/styles/global.css';
import 'universal/styles/reset.css';
import type { CookiesType } from 'universal/services/storage/cookies';
import { renderPageByUserAuth } from './utils';
import PrivateRoute from './PrivateRoute';

import * as RouteMap from './RouteMap';

type PropsType = {
  location: Object,
  cookies: CookiesType
};
class Routes extends Component<PropsType> {
  constructor(props: PropsType) {
    super(props);

    this.PrivateRouteHOC = PrivateRoute(props.cookies);
  }

  PrivateRouteHOC: ComponentType<*>

  render() {
    const {
      location,
      cookies,
    } = this.props;
    const { PrivateRouteHOC } = this;

    return [
      // <Route key="/" exact location={location} path="/" component={RouteMap.Home} />,
      <Route
        key="/"
        exact
        location={location}
        path="/"
        render={() => (
          renderPageByUserAuth({
            cookies,
            ComponentAuthUser: <RouteMap.Home />,
            ComponentNotAuthUser: (<Redirect to="/login" />),
          })
        )}
      />,
      <Route key="login" exact location={location} path="/login" component={RouteMap.LoadableLogin} />,
      <PrivateRouteHOC key="articles" exact location={location} path="/articles" component={RouteMap.ArticlesList} />,
    ];
  }
}

export default Routes;
