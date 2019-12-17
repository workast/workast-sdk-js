'use strict';

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const commonConfig = {
  entry: path.resolve(__dirname, 'src/workast.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          /node_modules/,
          /dist/
        ],
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};

const umdConfig = {
  ...commonConfig,
  mode: 'development',
  output: {
    filename: 'workast.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'Workast',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  plugins: [
    // Needs to be instantiated per config, sharing the reference to CleanWebpackPlugin
    // in commonConfig, will result in both build cleaning the path.output
    // of the first build that was executed.
    new CleanWebpackPlugin()
  ],
  devtool: false,
  externals: [
    nodeExternals()
  ]
};

const browserConfig = {
  ...commonConfig,
  mode: 'production',
  output: {
    filename: 'workast.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Workast',
    libraryTarget: 'window',
    globalObject: 'window'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  devtool: 'source-map'
};

module.exports = [
  umdConfig,
  browserConfig
];
