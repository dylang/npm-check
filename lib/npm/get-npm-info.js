'use strict';

var _ = require('lodash');
var getConf = require('./get-conf'); //Mock
var bestGuessHomepage = require('./../util/best-guess-homepage');
var registryUrl = require('registry-url')();
var semver = require('semver');

var registryClient = getConf.getRegistryClient();

function getNpmInfo(packageName){
    var getPath = packageName;
    return registryClient(registryUrl + getPath, {})
        .spread(function(rawData){

            var CRAZY_HIGH_SEMVER =  '8000.0.0';

            var sortedVersions = _(rawData.versions)
                .keys()
                .remove(_.partial(semver.gt, CRAZY_HIGH_SEMVER))
                .sort(semver.compare)
                .valueOf();

            var latest = semver.gt(CRAZY_HIGH_SEMVER, rawData['dist-tags'].latest) ? rawData['dist-tags'].latest : sortedVersions[0];

            return {
                version: latest,
                versions: sortedVersions,
                homepage: bestGuessHomepage(rawData)
            };

        }, function(err){
            var errorMessage = registryUrl + ' returned ' + err.message;
            //console.log('Error from registry:', errorMessage);
            return { error:  errorMessage };
        });
}

module.exports = getNpmInfo;
