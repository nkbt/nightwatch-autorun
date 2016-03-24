'use strict';


const cp = require('child_process');
const path = require('path');


cp.fork(path.join(__dirname, 'index.js'), {cwd: path.join(__dirname, 'test'), env: process.env})
  .on('error', err2 => console.error(err2.stack) || process.exit(1))
  .on('close', code => process.exit(code));
