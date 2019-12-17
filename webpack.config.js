'use strict';

const path = require('path');
const nodeExternals = require('webpack-node-externals');

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
  devtool: 'source-map'
};

module.exports = [
  umdConfig,
  browserConfig
];
