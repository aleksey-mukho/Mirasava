const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Paths
const root = process.cwd();
const src = path.join(root, 'srcClientAdmin');
const build = path.join(root, 'build');
const universal = path.join(src, 'universal');
const server = path.join(src, 'server');

const serverInclude = [server, universal];

export default {
  context: src,
  entry: {
    prerender: './universal/routes/Routes.js',
  },
  target: 'node',
  output: {
    path: build,
    chunkFilename: '[name]_[chunkhash].js',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['.js'],
    modules: [src, 'node_modules'],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __PRODUCTION__: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
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

      // CSS
      {
        test: /\.css$/,
        include: serverInclude,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              root: src,
              modules: true,
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
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: serverInclude,
      },
    ],
  },
};
