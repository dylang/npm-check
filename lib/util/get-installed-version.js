'use strict';

var path = require('path');

function installedVersion(dir, module) {
    // TODO - just check to see if it's there first
    var pkgJson = path.join(dir, 'node_modules', module, 'package.json');
    try {
        return require(pkgJson).version;
    } catch(err) {
    }
}

module.exports = installedVersion;