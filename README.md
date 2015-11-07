# nightwatch-autorun

Automatically installs Selenium (if necessary) and runs End-to-End tests with Nightwatch.


## What it does

1. Installs Selenium

2. Starts Selenium on default 4444 port with `-debug` outputs logs to `$LOG_DIR` or `$(pwd)/reports/selenium.log`

3. Starts WebpackDevServer based on `$WEBPACK_CONFIG` or `$(pwd)/webpack.config.js` on port `$PORT` or 8080

4. Runs Nightwatch with `$NIGHTWATCH_CONFIG` or `$(pwd)/nightwatch.json` or baked in `nightwatch.json` config and outputs reports to `$REPORT_DIR` or `$(pwd)/reports/test-e2e`


## Requirements

1. Java

    Required by Selenium

2. nightwatch.json configuration

3. webpack.config.js to run dev server

