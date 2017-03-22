'use strict';


const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
  entry: './index.js',
  output: {filename: 'bundle.js', path: path.resolve('example')},
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})
  ],
  stats: {colors: true}
};
