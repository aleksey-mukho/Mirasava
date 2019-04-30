// @flow
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const HMR = (app: express$Application) => {
  // eslint-disable-next-line global-require
  const devWebpackConfig = require("../../webpack/webpack.config.development.js");
  const compiler = webpack(devWebpackConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true,
      hot: true,
      publicPath: devWebpackConfig.output.publicPath,
    })
  );

  app.use(
    webpackHotMiddleware(compiler, {
      log: console.log, // eslint-disable-line no-console
      reload: true,
    })
  );

  return app;
};

module.exports = HMR;
