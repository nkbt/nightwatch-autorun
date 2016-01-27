'use strict';


const selenium = require('selenium-standalone');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');


const createWebpackServer = config => {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const webpackConfig = require(config.webpackConfig);

  return new WebpackDevServer(webpack(webpackConfig), {quiet: true});
};


const getConfig = options => {
  let nightwatchConfig = process.env.NIGHTWATCH_CONFIG ?
    path.resolve(process.env.NIGHTWATCH_CONFIG) : path.resolve(process.cwd(), 'nightwatch.json')

  try {
    require(nightwatchConfig);
  } catch (err) {
    console.log('Fallback to default nightwatch.json config');
    nightwatchConfig = path.resolve(__dirname, 'nightwatch.json');
  }

  const config = Object.assign({
    logDir: process.env.LOG_DIR ?
      path.resolve(process.env.LOG_DIR) : path.resolve(process.cwd(), 'reports'),
    reportDir: process.env.REPORT_DIR ?
      path.resolve(process.env.REPORT_DIR) : path.resolve(process.cwd(), 'reports', 'test-e2e'),
    nightwatchConfig,
    webpackConfig: process.env.WEBPACK_CONFIG ?
      path.resolve(process.env.WEBPACK_CONFIG) : path.resolve(process.cwd(), 'webpack.config.js'),
    port: process.env.PORT || 8080
  }, options);

  return Object.assign({}, config, {
    server: config.server || createWebpackServer(config)
  });
};


module.exports = options => {
  const config = getConfig(options);

  const startServer = callback =>
    config.server.listen(process.env.PORT || 8080, '0.0.0.0', callback);


  const onServerStarted = seleniumChild => err => {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }

    mkdirp.sync(config.reportDir);

    const which = require('npm-which')(__dirname);
    const nightwatchRunner = which.sync('nightwatch');

    cp.fork(nightwatchRunner,
      [
        '--config', config.nightwatchConfig,
        '--output', config.reportDir
      ])
      .on('error', err2 => {
        console.error(err2.stack);
        process.exit(1);
      })
      .on('close', code => {
        seleniumChild.kill('SIGINT');
        process.exit(code);
      });
  };


  function onSeleniumStarted(err, seleniumChild) {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }
    const seleniumLog = fs.createWriteStream(path.resolve(config.logDir, 'selenium.log'));

    seleniumChild.stdout.pipe(seleniumLog);
    seleniumChild.stderr.pipe(seleniumLog);

    process.on('uncaughtException', err2 => {
      console.error(err2.stack);
      seleniumChild.kill('SIGINT');
      process.exit(1);
    });

    startServer(onServerStarted(seleniumChild));
  }


  function onSeleniumInstalled(err) {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }

    selenium.start({seleniumArgs: ['-debug']}, onSeleniumStarted);
  }

  selenium.install({}, onSeleniumInstalled);
};