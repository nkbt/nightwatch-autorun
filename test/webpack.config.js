'use strict';


process.env.NODE_ENV = 'production';


var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');


module.exports = {
  devtool: 'source-map',
  entry: './index.js',
  output: {filename: 'bundle.js', path: path.resolve('example')},
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],

  resolve: {extensions: ['', '.js']},
  stats: {colors: true}
};
