const path = require('path');
const webpack = require('webpack');

const root = path.resolve(__dirname, '../');
const src = path.join(root, 'srcClientAdmin');

const clientSrc = path.join(src, 'client');
const universalSrc = path.join(src, 'universal');

const clientInclude = [clientSrc, universalSrc];
const babelQuery = {
  plugins: [
    'react-hot-loader/babel',
  ],
};

module.exports = {
  devtool: 'eval-source-map',
  context: src,
  entry: {
    app: [
      'babel-polyfill/dist/polyfill.js',
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?noInfo=false',
      './client/client.js',
    ],
  },
  output: {
    filename: 'app.js',
    chunkFilename: '[name]_[chunkhash].js',
    path: path.join(root, 'build'),
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __PRODUCTION__: false,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  resolve: {
    extensions: ['.js'],
    modules: [src, 'node_modules'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png|j|jpeg|jpg|gif|svg|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
      // {
      //   test: /\.(png|j|jpeg|jpg|gif|svg|woff|woff2)$/,
      //   use: {
      //     loader: 'file-loader',
      //     options: {
      //       name: '[path][name].[ext]?[hash:8]',
      //     },
      //   },
      // },

      // Javascript
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: babelQuery,
        include: clientInclude,
      },

      // CSS
      {
        test: /\.css$/,
        include: clientInclude,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              root: src,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './postcss.config.js',
              },
            },
          },
        ],
      },
    ],
  },
};
