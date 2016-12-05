# nightwatch-autorun [![npm](https://img.shields.io/npm/v/nightwatch-autorun.svg?style=flat-square)](https://www.npmjs.com/package/nightwatch-autorun)

[![Discord](https://img.shields.io/badge/chat-discord-blue.svg?style=flat-square)](https://discord.gg/013tGW1IMcW6Vd1o7)

[![CircleCI](https://img.shields.io/circleci/project/nkbt/nightwatch-autorun.svg?style=flat-square&label=nix-build)](https://circleci.com/gh/nkbt/nightwatch-autorun)
[![AppVeyor](https://img.shields.io/appveyor/ci/nkbt/nightwatch-autorun.svg?style=flat-square&label=win-build)](https://ci.appveyor.com/project/nkbt/nightwatch-autorun)
[![Travis](https://img.shields.io/travis/nkbt/nightwatch-autorun.svg?style=flat-square&label=matrix-build)](https://travis-ci.org/nkbt/nightwatch-autorun)
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

3. Make sure you have latest Chrome installed

4. When using CircleCI change project settings to use the latest Ubuntu, which includes the latest Chrome: https://circleci.com/docs/build-image-trusty/

5. Alternatively you may add these lines to install the latest chrome on CircleCI ( or similarly on TravisCI):
  ```
  dependencies:
    pre:
      - wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
      - sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
      - sudo apt-get update
      - sudo apt-get --only-upgrade install google-chrome-stable
  ```
