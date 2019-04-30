// @flow
import { Observable } from "rxjs";
import {
  // compose,
  createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { routerReducer, routerMiddleware } from "react-router-redux";
import { createEpicMiddleware } from "redux-observable";

import type { AjaxType } from "universal/services/api/utils";
import utils from "universal/services/api/utils";
import { devMode } from "server/constants";
import * as reducers from "./reducers";
import rootEpic from "./epics";
import api from "../services/api";
import type { CookiesType } from "../services/storage/cookies";

const R = require("ramda");

export default {
  getIsPROD: () => devMode === "production",

  getApiCollections: (ajaxInjectedCookies: AjaxType => Observable<mixed>) =>
    Object.keys(api).reduce((acc, apiName) => {
      // $FlowFixMe
      acc[apiName] = api[apiName](ajaxInjectedCookies);
      return acc;
    }, {}),

  getEpicMiddleware({
    cookies,
    history,
  }: {
    cookies: CookiesType,
    history: {},
  }) {
    const ajaxInjectedCookies = utils.ajax(cookies);
    const apiCollections = this.getApiCollections(ajaxInjectedCookies);
    return createEpicMiddleware({
      dependencies: {
        ...apiCollections,
        cookies,
        history,
      },
    });
  },

  getMiddlewares({ cookies, history }: { cookies: CookiesType, history: {} }) {
    const routerMiddlewareWithHistory = routerMiddleware(history);
    const epicMiddleware = this.getEpicMiddleware({ cookies, history });
    return [epicMiddleware, routerMiddlewareWithHistory];
  },

  activateHMRForReducers({ store, module }: { store: Object, module: Object }) {
    module.hot.accept("./reducers", () => {
      const nextReducers = require("./reducers/index.js"); // eslint-disable-line global-require
      const rootReducer = combineReducers({
        ...nextReducers,
        router: routerReducer,
      });

      store.replaceReducer(rootReducer);
    });
  },

  checkIsActivateHMR(store: Object, module: Object) {
    R.when(R.complement(R.not), () =>
      this.activateHMRForReducers({ store, module })
    )(module.hot);
  },

  createDevLogger: (middlewares: Array<mixed>): void => {
    const { createLogger } = require("redux-logger");
    const logger = createLogger({
      predicate: R.T(),
      collapsed: true,
      duration: true,
    });
    middlewares.push(logger);
  },

  checkIsCreateLogger(middlewares: Array<mixed>): void {
    R.when(() => !this.getIsPROD(), this.createDevLogger)(middlewares);
  },

  createReduxStore(history: {}, cookies: CookiesType): {} {
    const middlewares = this.getMiddlewares({ cookies, history });
    this.checkIsCreateLogger(middlewares);

    const initialState = {};

    const store = createStore(
      combineReducers({
        ...reducers,
        router: routerReducer,
      }),
      initialState,
      applyMiddleware(...middlewares)
    );

    middlewares[0].run(rootEpic);

    this.checkIsActivateHMR(store, module);

    return store;
  },
};
