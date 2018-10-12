// @flow
import type { $Request, $Response } from 'express';

const React = require('react');
const Cookies = require('universal-cookie');
const { renderToNodeStream } = require('react-dom/server');
const createHistory = require('history/createMemoryHistory').default;

const createStore = require('universal/redux/createStore');

const Html = require('./Html');

function renderApp(req, res, store, cookies, assets) {
  const context = {};
  res.write('<!DOCTYPE html>');
  const stream = renderToNodeStream(
    <Html
      title="🧝‍ Mirasava"
      store={store}
      url={req.url}
      context={context}
      cookies={cookies}
      assets={assets}
    />,
  );
  stream.pipe(res, { end: true });
}

const renderPage = (req: $Request, res: $Response) => {
  const history = createHistory();
  const cookies = new Cookies(req.headers.cookie);
  // $FlowFixMe
  const store = createStore.createReduxStore(history, cookies);

  // $FlowFixMe
  const assets = require('../../build/assets.json'); // eslint-disable-line import/no-unresolved

  renderApp(req, res, store, cookies, assets);
};

const renderDevPage = (req: $Request, res: $Response) => {
  const history = createHistory();
  const cookies = new Cookies(req.headers.cookie);
  // $FlowFixMe
  const store = createStore.createReduxStore(history, cookies);
  renderApp(req, res, store, cookies);
};

module.exports = {
  renderPage,
  renderDevPage,
};
