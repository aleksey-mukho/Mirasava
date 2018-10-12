const path = require('path');
const webpack = require('webpack');

const AssetsPlugin = require('assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { ReactLoadablePlugin } = require('react-loadable/webpack');

const root = process.cwd();
const src = path.join(root, 'srcClientAdmin');
const build = path.join(root, 'build');

const clientSrc = path.join(src, 'client');
const universalSrc = path.join(src, 'universal');

const clientInclude = [clientSrc, universalSrc];

export default {
  context: src,
  entry: {
    app: [
      './client/client.js',
    ],
  },
  output: {
    chunkFilename: '[name]_[chunkhash].js',
    path: build,
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['.js'],
    modules: [src, 'node_modules'],
    unsafeCache: true,
  },
  node: {
    dns: 'mock',
    net: 'mock',
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),

    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10 }),
    new AssetsPlugin({ path: build, filename: 'assets.json' }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __PRODUCTION__: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new ReactLoadablePlugin({
      filename: path.join(root, 'build/react-loadable.json'),
    }),
  ],
  mode: 'production',
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

      // JavaScript
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: clientInclude,
      },

      // CSS
      {
        test: /\.css$/,
        include: clientInclude,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              root: src,
              modules: true,
              minimize: true,
              importLoaders: 1,
              localIdentName: '[hash:base64:3]',
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
