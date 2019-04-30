import * as reduxLogger from "redux-logger";
import * as redux from "redux";
import * as reduxObservable from "redux-observable";
import * as reactRouterRedux from "react-router-redux";
import * as serverConstants from "server/constants";
import utils from "universal/services/api/utils";
import rootEpic from "../epics";
import * as createStore from "../createStore";
import * as nextReducers from "../reducers";

const apiCollections = {
  authApi: () => ({}),
  userApi: () => ({}),
};
const epicMiddleware = {
  test: "test",
};
const ajaxInjectedCookies = () => "ajaxInjectedCookies";

// jest.unmock('../createStore');
jest.mock("redux-logger", () => ({
  createLogger: jest.fn(() => "logger"),
}));

jest.mock("redux");
jest.mock("redux-observable");
jest.mock("react-router-redux");

jest.mock("universal/services/api/utils");

jest.mock("../../services/api", () => ({
  authApi: () => ({}),
  userApi: () => ({}),
}));

jest.mock("server/constants");
jest.mock("../epics");
jest.mock("../reducers");

const cookies = { cookies: "cookies" };
const history = { history: "history" };

// const createStore = require('../createStore');
describe("createStore", () => {
  describe("getIsPROD", () => {
    test("Return true, when devMode === production", () => {
      serverConstants.devMode = "production";
      expect(createStore.getIsPROD()).toBe(true);
    });

    test("Return false, when devMode === development", () => {
      serverConstants.devMode = "development";
      expect(createStore.getIsPROD()).toBe(false);
    });
  });

  describe("getApiCollections", () => {
    test("Return transform ajaxInjectedCookies, when was called getApiCollections", () => {
      expect(createStore.getApiCollections(ajaxInjectedCookies)).toEqual({
        authApi: {},
        userApi: {},
      });
    });
  });

  describe("getEpicMiddleware", () => {
    test("Return epicMiddleware", () => {
      utils.ajax = jest.fn(() => "ajaxInjectedCookies");
      reduxObservable.createEpicMiddleware = jest.fn(() => epicMiddleware);
      createStore.getApiCollections = jest.fn(() => apiCollections);

      const middleware = createStore.getEpicMiddleware({ cookies, history });

      expect(utils.ajax).toHaveBeenCalled();
      expect(utils.ajax).toHaveBeenCalledTimes(1);
      expect(utils.ajax).toHaveBeenCalledWith(cookies);

      expect(createStore.getApiCollections).toHaveBeenCalled();
      expect(createStore.getApiCollections).toHaveBeenCalledTimes(1);
      expect(createStore.getApiCollections).toHaveBeenCalledWith(
        "ajaxInjectedCookies"
      );

      expect(reduxObservable.createEpicMiddleware).toHaveBeenCalled();
      expect(reduxObservable.createEpicMiddleware).toHaveBeenCalledTimes(1);
      expect(reduxObservable.createEpicMiddleware).toHaveBeenCalledWith({
        dependencies: {
          ...apiCollections,
          cookies,
          history,
        },
      });

      expect(middleware).toEqual(epicMiddleware);
    });
  });

  describe("getMiddlewares", () => {
    test("Return array epics", () => {
      reactRouterRedux.routerMiddleware = jest.fn(() => history);
      createStore.getEpicMiddleware = jest.fn(() => epicMiddleware);

      const middlewares = createStore.getMiddlewares({ cookies, history });

      expect(middlewares).toEqual([epicMiddleware, history]);

      expect(reactRouterRedux.routerMiddleware).toHaveBeenCalled();
      expect(reactRouterRedux.routerMiddleware).toHaveBeenCalledTimes(1);
      expect(reactRouterRedux.routerMiddleware).toHaveBeenCalledWith(history);

      expect(createStore.getEpicMiddleware).toHaveBeenCalled();
      expect(createStore.getEpicMiddleware).toHaveBeenCalledTimes(1);
      expect(createStore.getEpicMiddleware).toHaveBeenCalledWith({
        cookies,
        history,
      });
    });
  });

  describe("checkIsCreateLogger", () => {
    const middlewares = [];
    test("createDevLogger was called, when getIsPROD return false", () => {
      createStore.createDevLogger = jest.fn();
      createStore.getIsPROD = jest.fn(() => false);
      createStore.checkIsCreateLogger(middlewares);

      expect(createStore.createDevLogger).toHaveBeenCalled();
      expect(createStore.createDevLogger).toHaveBeenCalledTimes(1);
      expect(createStore.createDevLogger).toHaveBeenCalledWith(middlewares);

      expect(createStore.getIsPROD).toHaveBeenCalled();
      expect(createStore.getIsPROD).toHaveBeenCalledTimes(1);
    });

    test("createDevLogger wasn't called, when getIsPROD return true", () => {
      createStore.createDevLogger = jest.fn();
      createStore.getIsPROD = jest.fn().mockReturnValue(true);
      createStore.checkIsCreateLogger(middlewares);

      expect(createStore.createDevLogger).not.toHaveBeenCalled();
    });
  });

  describe("createDevLogger", () => {
    const middlewares = [];
    test("createLogger was called, when createDevLogger was called", () => {
      const { createDevLogger } = require("../createStore");
      createDevLogger(middlewares);

      expect(reduxLogger.createLogger).toHaveBeenCalled();
      expect(reduxLogger.createLogger).toHaveBeenCalledTimes(1);

      expect(middlewares).toEqual(["logger"]);
    });
  });

  describe("activateHMRForReducers", () => {
    test("replaceReducer and combineReducers were called", () => {
      module.hot = {
        accept: jest.fn((url, cb) => cb()),
      };
      redux.combineReducers = jest.fn();

      const store = {
        replaceReducer: jest.fn(),
      };

      createStore.activateHMRForReducers({ store, module });

      expect(module.hot.accept).toHaveBeenCalled();
      expect(module.hot.accept).toHaveBeenCalledTimes(1);

      expect(redux.combineReducers).toHaveBeenCalled();
      expect(redux.combineReducers).toHaveBeenCalledTimes(1);

      expect(store.replaceReducer).toHaveBeenCalled();
      expect(store.replaceReducer).toHaveBeenCalledTimes(1);
    });
  });

  describe("checkIsActivateHMR", () => {
    test("activateHMRForReducers was called, when module.hot === true", () => {
      const store = {};
      module.hot = true;
      createStore.activateHMRForReducers = jest.fn();

      createStore.checkIsActivateHMR(store, module);

      expect(createStore.activateHMRForReducers).toHaveBeenCalled();
      expect(createStore.activateHMRForReducers).toHaveBeenCalledTimes(1);
      expect(createStore.activateHMRForReducers).toHaveBeenCalledWith({
        store,
        module,
      });
    });

    test("activateHMRForReducers was not called, when module.hot === undefined", () => {
      const store = {};
      module.hot = undefined;
      createStore.activateHMRForReducers = jest.fn();

      createStore.checkIsActivateHMR(store, module);

      expect(createStore.activateHMRForReducers).not.toHaveBeenCalled();
    });
  });

  describe("createReduxStore", () => {
    test("Functions were called", () => {
      const middlewares = [
        {
          run: jest.fn(),
        },
      ];
      const store = {
        store: "store",
      };
      redux.combineReducers = jest.fn(() => "combineReducers");
      redux.applyMiddleware = jest.fn(() => "applyMiddleware");
      redux.createStore = jest.fn(() => store);
      createStore.checkIsCreateLogger = jest.fn();
      createStore.getMiddlewares = jest.fn(() => middlewares);
      createStore.checkIsActivateHMR = jest.fn();

      const createdStore = createStore.createReduxStore(history, cookies);

      expect(createStore.getMiddlewares).toHaveBeenCalled();
      expect(createStore.getMiddlewares).toHaveBeenCalledTimes(1);
      expect(createStore.getMiddlewares).toHaveBeenCalledWith({
        history,
        cookies,
      });

      expect(createStore.checkIsCreateLogger).toHaveBeenCalled();
      expect(createStore.checkIsCreateLogger).toHaveBeenCalledTimes(1);
      expect(createStore.checkIsCreateLogger).toHaveBeenCalledWith(middlewares);

      expect(redux.createStore).toHaveBeenCalled();
      expect(redux.createStore).toHaveBeenCalledTimes(1);
      expect(redux.createStore).toHaveBeenCalledWith(
        "combineReducers",
        {},
        "applyMiddleware"
      );

      expect(redux.combineReducers).toHaveBeenCalled();
      expect(redux.combineReducers).toHaveBeenCalledTimes(1);
      expect(redux.combineReducers).toHaveBeenCalledWith({
        ...nextReducers,
        router: reactRouterRedux.routerReducer,
      });

      expect(redux.applyMiddleware).toHaveBeenCalled();
      expect(redux.applyMiddleware).toHaveBeenCalledTimes(1);
      expect(redux.applyMiddleware).toHaveBeenCalledWith(...middlewares);

      expect(middlewares[0].run).toHaveBeenCalled();
      expect(middlewares[0].run).toHaveBeenCalledTimes(1);
      expect(middlewares[0].run).toHaveBeenCalledWith(rootEpic);

      expect(createStore.checkIsActivateHMR).toHaveBeenCalled();
      expect(createStore.checkIsActivateHMR).toHaveBeenCalledTimes(1);

      expect(store).toEqual(createdStore);
    });
  });
});
