#!/usr/bin/env node

var selenium = require('selenium-standalone');
var cp = require('child_process');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require(process.env.WEBPACK_CONFIG ?
  path.resolve(process.env.WEBPACK_CONFIG) : path.resolve(process.cwd(), 'webpack.config.js'));
var logDir = process.env.LOG_DIR ?
  path.resolve(process.env.LOG_DIR) : path.resolve(process.cwd(), 'reports');
var reportDir = process.env.REPORT_DIR ?
  path.resolve(process.env.REPORT_DIR) : path.resolve(process.cwd(), 'reports', 'test-e2e');
var nightwatchConfig = process.env.NIGHTWATCH_CONFIG ?
  path.resolve(process.env.NIGHTWATCH_CONFIG) : path.resolve(process.cwd(), 'nightwatch.json');


mkdirp.sync(reportDir);


try {
  require(nightwatchConfig);
} catch (err) {
  console.log('Fallback to default nightwatch.json config');
  nightwatchConfig = path.resolve(__dirname, 'nightwatch.json');
}


var seleniumLog = fs.createWriteStream(path.resolve(logDir, 'selenium.log'));
var which = require('npm-which')(__dirname);
var nightwatchRunner = which.sync('nightwatch');


function startServer(cb) {
  var server = new WebpackDevServer(webpack(webpackConfig), {quiet: true});

  server.listen(process.env.PORT || 8080, '0.0.0.0', cb);
}


function onServerStarted(seleniumChild) {
  return function (err) {
    if (err) {
      console.error(err);
      console.log(err.stack);
      throw err;
    }

    cp.fork(nightwatchRunner,
      [
        '--config', nightwatchConfig,
        '--output', reportDir
      ])
      .on('error', function (err2) {
        console.error(err2);
        console.log(err2.stack);
        throw err2;
      })
      .on('close', function (code) {
        seleniumChild.kill('SIGINT');
        process.exit(code);
      });
  };
}


function onSeleniumStarted(err, seleniumChild) {
  if (err) {
    console.error(err);
    console.log(err.stack);
    throw err;
  }
  seleniumChild.stdout.pipe(seleniumLog);
  seleniumChild.stderr.pipe(seleniumLog);

  process.on('uncaughtException', function (err2) {
    console.error(err2);
    console.log(err2.stack);
    seleniumChild.kill('SIGINT');
    throw err2;
  });

  startServer(onServerStarted(seleniumChild));
}


function onSeleniumInstalled(err) {
  if (err) {
    console.error(err);
    console.log(err.stack);
    throw err;
  }

  selenium.start({seleniumArgs: ['-debug']}, onSeleniumStarted);
}


selenium.install({}, onSeleniumInstalled);
