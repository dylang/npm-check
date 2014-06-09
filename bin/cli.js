#!/usr/bin/env node

var cwd = process.cwd();
var pkgJson = require('../package.json');
var npmCheck = require('../lib/npm-check');
var output = require('../lib/output');

process.title = pkgJson.name;

npmCheck(cwd)
    .then(output)
    .catch(function(err){
        console.log('[npm-check]', err.stack || err);
        process.exit(1);
    })
    .done()
