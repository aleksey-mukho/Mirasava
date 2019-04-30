// @flow
import React from "react";
import type { ComponentType } from "react";
import { hydrate } from "react-dom";
import { Provider } from "react-redux";
import Loadable from "react-loadable";
import { AppContainer } from "react-hot-loader";
import Cookies from "universal-cookie";
import createHistory from "history/createBrowserHistory";

import createStore from "universal/redux/createStore";
import Notifications from "universal/modules/notifications";

import AppClientRender from "./containers/AppClientRender";

const history = createHistory();

const cookies = new Cookies();

const store: Object = createStore.createReduxStore(history, cookies);

const rootEl = document.getElementById("root");

const renderApp = (Component: ComponentType<*>) => {
  Loadable.preloadReady().then(() => {
    hydrate(
      <AppContainer>
        <Provider store={store}>
          <div>
            <Component history={history} cookies={cookies} />
            <Notifications />
          </div>
        </Provider>
      </AppContainer>,
      rootEl
    );
  });
};

renderApp(AppClientRender);

if (module.hot) {
  module.hot.accept("./containers/AppClientRender.js", () => {
    const nextApp = require("./containers/AppClientRender");
    // $FlowFixMe
    renderApp(nextApp);
  });
}
