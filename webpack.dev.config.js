var path = require('path');
var webpack = require('webpack');
var buildPath = path.resolve(__dirname, 'grails-app', 'assets', 'javascript');
var mainPath = path.resolve(__dirname, 'frontend', 'scripts', 'app.js');

module.exports = {
  entry: [
    'bootstrap-loader',
    'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    mainPath // Your appʼs entry point
  ],
  output: {
    path: buildPath,
    publicPath: 'http://localhost:3000/',
    filename: 'jesqueAdmin.js'
  },
  module: {
    include: /scripts/,
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel?presets[]=es2015&presets[]=react&plugins[]=lodash&sourceMap=inline']
      },
      {
        test: /\.eot(\?\S*)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject'
      },
      {
        test: /\.woff2(\?\S*)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/font-woff2'
      },
      {
        test: /\.woff(\?\S*)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?\S*)?$/,
        loader: 'url-loader?limit=100000&mimetype=application/font-ttf'
      },
      {
        test: /\.(png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=8192'
      }
    ]
  },
  devtool: 'eval-cheap-module-source-map',
  cache: true,
  debug: true,
  stats: {
    colors: true,
    reasons: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  eslint: {
    fix: false
  }
};
