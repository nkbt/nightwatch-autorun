# nightwatch-autorun [![npm](https://img.shields.io/npm/v/nightwatch-autorun.svg?style=flat-square)](https://www.npmjs.com/package/nightwatch-autorun)

[![Gitter](https://img.shields.io/gitter/room/nkbt/help.svg?style=flat-square)](https://gitter.im/nkbt/help)

[![CircleCI](https://img.shields.io/circleci/project/nkbt/nightwatch-autorun.svg?style=flat-square&label=nix-build)](https://circleci.com/gh/nkbt/nightwatch-autorun)
[![Dependencies](https://img.shields.io/david/nkbt/nightwatch-autorun.svg?style=flat-square)](https://david-dm.org/nkbt/nightwatch-autorun)
[![Dev Dependencies](https://img.shields.io/david/dev/nkbt/nightwatch-autorun.svg?style=flat-square)](https://david-dm.org/nkbt/nightwatch-autorun#info=devDependencies)


Automatically installs Selenium (if necessary) and runs End-to-End tests with Nightwatch.


## What it does

1. Installs Selenium

2. Starts Selenium on default 4444 port with `-debug` outputs logs to `$LOG_DIR` or `$(pwd)/reports/selenium.log`

3. Starts WebpackDevServer based on `$WEBPACK_CONFIG` or `$(pwd)/webpack.config.js` on port `$PORT` or 8080

4. Runs Nightwatch with `$NIGHTWATCH_CONFIG` or `$(pwd)/nightwatch.json` or baked in `nightwatch.json` config and outputs reports to `$REPORT_DIR` or `$(pwd)/reports/test-e2e`


## Requirements

1. Java

    Required by Selenium

2. webpack.config.js to run dev server


## Updating google-chrome

Selenium-standalone requires the most stable google chrome version. CircleCI