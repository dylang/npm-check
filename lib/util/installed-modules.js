'use strict';
const _ = require('lodash');
const globby = require('globby');
const readPackageJson = require('./read-package-json');
const path = require('path');
const options = require('./options');

module.exports = function() {
    const GLOBBY_PACKAGE_JSON = '{*/package.json,@*/*/package.json}';
    const installedPackages = globby.sync(path.resolve(options.get('nodeModulesPath'), GLOBBY_PACKAGE_JSON));

    return _(installedPackages)
            .map(function (pkgPath) {
                const pkg = readPackageJson(path.resolve(pkgPath));
                return [pkg.name, pkg.version];
            })
            .fromPairs()
            .valueOf();
};