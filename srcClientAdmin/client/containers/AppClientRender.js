// @flow
import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import type { CookiesType } from 'universal/services/storage/cookies';
import Routes from 'universal/routes/Routes';

const AppClientRender = ({ history, cookies }: {
  history: {}, cookies: CookiesType
}) => (
  <ConnectedRouter history={history}>
    <Route render={
      ({ location }) => (
        <Routes location={location} cookies={cookies} />
      )}
    />
  </ConnectedRouter>
);

export default AppClientRender;
