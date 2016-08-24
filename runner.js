'use strict';


const selenium = require('selenium-standalone');
const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const util = require('util');


const NIGHTWATCH_CONFIG = process.env.NIGHTWATCH_CONFIG;
const LOG_DIR = process.env.LOG_DIR;
const REPORT_DIR = process.env.REPORT_DIR;
const NIGHTWATCH_ENV = process.env.NIGHTWATCH_ENV;
const WEBPACK_CONFIG = process.env.WEBPACK_CONFIG;
const NODE_PORT = process.env.NODE_PORT;
const PORT = process.env.PORT;
const TUNNEL_IDENTIFIER = process.env.TUNNEL_IDENTIFIER;


const createWebpackServer = config => {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');

  const webpackConfig = require(config.webpackConfig);

  return new WebpackDevServer(webpack(webpackConfig), {quiet: true});
};


const getConfig = options => {
  let nightwatchConfig = NIGHTWATCH_CONFIG ?
    path.resolve(NIGHTWATCH_CONFIG) : path.resolve(process.cwd(), 'nightwatch.json');

  try {
    require(nightwatchConfig);
  } catch (err) {
    console.log('Fallback to default nightwatch.json config');
    nightwatchConfig = path.resolve(__dirname, 'nightwatch.json');
  }

  const config = Object.assign({
    logDir: LOG_DIR ?
      path.resolve(LOG_DIR) : path.resolve(process.cwd(), 'reports'),
    reportDir: REPORT_DIR ?
      path.resolve(REPORT_DIR) : path.resolve(process.cwd(), 'reports', 'test-e2e'),
    nightwatchConfig,
    nightwatchEnv: NIGHTWATCH_ENV || 'default',
    webpackConfig: WEBPACK_CONFIG ?
      path.resolve(WEBPACK_CONFIG) : path.resolve(process.cwd(), 'webpack.config.js'),
    port: NODE_PORT || PORT || 8080,
    tunnelIdentifier: TUNNEL_IDENTIFIER || undefined
  }, options);

  console.log(`Running with config:\n${util.inspect(config, {depth: 0, colors: true})}`);

  return Object.assign({}, config, {
    server: config.server || createWebpackServer(config)
  });
};


module.exports = options => {
  const config = getConfig(options);

  const startServer = callback =>
    config.server.listen(config.port, '0.0.0.0', callback);


  const onServerStarted = seleniumChild => err => {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }

    mkdirp.sync(config.reportDir);

    const which = require('npm-which')(__dirname);

    const nightwatchRunner = which.sync('nightwatch');

    const args = [
      '--config', config.nightwatchConfig,
      '--env', config.nightwatchEnv,
      '--output', config.reportDir
    ];

    cp.spawn(nightwatchRunner, args, {stdio: 'inherit'})
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

    mkdirp.sync(config.logDir);

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

  let progress;
  selenium.install({
    logger: message => console.log(message),
    progressCb: (totalLength, progressLength) => {
      const newProgress = (100 * (progressLength / totalLength));
      if (!progress || (newProgress - progress > 5) || newProgress > 99) {
        progress = newProgress;
        console.log(`Downloading: ${progress.toFixed(2)}%`);
      }
    }
  }, onSeleniumInstalled);
};
