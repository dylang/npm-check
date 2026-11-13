'use strict';

const extend = require('xtend');
const fs = require('fs');

function readPackageJson(filename) {
    let pkg;
    let error;
    try {
        pkg = JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (e) {
        if (e.code === 'ENOENT') {
            error = new Error(`A package.json was not found at ${filename}`);
        } else if(e instanceof SyntaxError) {
            error = new Error(`A package.json was found at ${filename}, but it is not valid.`);
        } else {
            error = e;
        }
    }
    return extend({devDependencies: {}, dependencies: {}, error: error}, pkg)
}

module.exports = readPackageJson;
