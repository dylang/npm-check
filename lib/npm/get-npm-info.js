'use strict';

var _ = require('lodash');
var getConf = _.memoize(require('./get-conf').getRegistry); //Mock
var bestGuessHomepage = require('./../util/best-guess-homepage');
var registryUrl = require('registry-url');
var semver = require('semver');

function getNpmInfo(packageName){
    var getPath = packageName; // + '/latest';

    return getConf()
        .then(function(registry) {
            return registry.client(registryUrl + getPath, {
                timeout: 0.1,
                staleOk: true
            }); // , 1, true, true for mocking
        })
        .spread(function(rawData){

            var CRAZY_HIGH_SEMVER =  '8000.0.0';

            var sortedVersions = _(rawData.versions)
                .keys()
                .remove(_.partial(semver.gt, CRAZY_HIGH_SEMVER))
                .sort(semver.lt)
                .valueOf();

            var latest = semver.gt(CRAZY_HIGH_SEMVER, rawData['dist-tags'].latest) ? rawData['dist-tags'].latest : sortedVersions[0];

            return {
                version: latest,
                versions: sortedVersions,
                homepage: bestGuessHomepage(rawData)
            };

        }, function(err){
            var errorMessage = registryUrl + ' returned ' + err.message;
            console.log('Error from registry:', errorMessage);
            return { error:  errorMessage };
        });
}

module.exports = getNpmInfo;
