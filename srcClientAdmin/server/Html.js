// @flow
import React from "react";
import { StaticRouter } from "react-router-dom";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import Loadable from "react-loadable";
import { getBundles } from "react-loadable/webpack";

// import Notifications from 'universal/modules/notifications';
import type { CookiesType } from "universal/services/storage/cookies";

type PropsType = {
  title: string,
  store: Object,
  cookies: CookiesType,
  assets: ?{
    app: {
      js: string,
    },
  },
  url: string,
};
/* eslint-disable import/no-unresolved */
const Html = (props: PropsType) => {
  const PROD = process.env.NODE_ENV === "production";
  // $FlowFixMe
  const stats = PROD ? require("../../build/react-loadable.json") : {};
  const { title, store, assets, cookies, url } = props;

  const { app } = assets || {};
  // $FlowFixMe
  const Layout = PROD ? require("../../build/prerender") : () => {};
  const modules = [];

  const root =
    PROD &&
    renderToString(
      <Loadable.Capture
        report={moduleName => {
          modules.push(moduleName);
        }}>
        <Provider store={store}>
          <div>
            <StaticRouter location={url} context={{}}>
              <Layout cookies={cookies} />
            </StaticRouter>
          </div>
        </Provider>
      </Loadable.Capture>
    );

  const bundles = getBundles(stats, modules);

  const styles = bundles.filter(bundle => bundle.file.endsWith(".css"));
  const scripts = bundles.filter(bundle => bundle.file.endsWith(".js"));

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Eczar:400"
          rel="stylesheet"
        />
        {PROD && <link rel="stylesheet" type="text/css" href="/static/0.css" />}
        {PROD && (
          <link rel="stylesheet" type="text/css" href="/static/app.css" />
        )}
        {PROD &&
          styles.map(style => (
            <link
              rel="stylesheet"
              type="text/css"
              href={`/static/${style.file}`}
            />
          ))}
        {PROD &&
          scripts.map(script => (
            <script charSet="utf-8" src={`/static/${script.file}`} async />
          ))}
      </head>
      <body>
        {/* eslint-disable react/no-danger */}
        {PROD ? (
          <div id="root" dangerouslySetInnerHTML={{ __html: root }} />
        ) : (
          <div id="root" />
        )}
        <script src={PROD ? app.js : "/static/app.js"} async />
      </body>
    </html>
  );
};

module.exports = Html;
