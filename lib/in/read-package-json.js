'use strict';

const extend = require('xtend');
const fs = require('fs');

function readPackageJson(filename) {
    let pkg;
    let error;
    try {
        pkg = JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            error = new Error(`A package.json was not found at ${filename}`);
        } else {
            error = new Error(`A package.json was found at ${filename}, but it is not valid.`);
        }
    }
    return extend({devDependencies: {}, dependencies: {}, error: error}, pkg)
}

module.exports = readPackageJson;
