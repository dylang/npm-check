'use strict';

const chalk = require('chalk');
const _ = require('lodash');
const fs = require("fs");

function outputJSON(currentState, filename) {
    const packages = currentState.get('packages');
    fs.writeFileSync(filename, JSON.stringify(packages, null, 4));
    console.log(`Report saved to ${filename}`)
    process.exitCode = 0;
}

module.exports = outputJSON;
