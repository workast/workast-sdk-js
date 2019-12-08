const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/workast.js'),
  output: {
    filename: 'workast.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Workast',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        exclude: [
          /node_modules/,
          /dist/
        ],
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  devtool: 'source-map',
  externals: [
    {
      'lodash.get': {
        commonjs: 'lodash.get',
        commonjs2: 'lodash.get',
        amd: 'lodash.get'
      },
      'lodash.isobject': {
        commonjs: 'lodash.isobject',
        commonjs2: 'lodash.isobject',
        amd: 'lodash.isobject'
      },
      'lodash.isstring': {
        commonjs: 'lodash.isstring',
        commonjs2: 'lodash.isstring',
        amd: 'lodash.isstring'
      },
      qs: {
        commonjs: 'qs',
        commonjs2: 'qs',
        amd: 'qs'
      },
      superagent: {
        commonjs: 'superagent',
        commonjs2: 'superagent',
        amd: 'superagent'
      }
    },
    /\@babel\/runtime/
  ]
};
