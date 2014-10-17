'use strict';

var _ = require('lodash');
var getRegistry = _.memoize(require('./get-registry').getRegistry); //Mock
var bestGuessHomepage = require('./../util/best-guess-homepage');

function getNpmInfo(packageName){
    var getPath = packageName; // + '/latest';

    return getRegistry()
        .then(function(registry) {
            return registry.client(registry.url + getPath, {
                timeout: 0.1,
                staleOk: true
            }); // , 1, true, true for mocking
        })
        .spread(function(rawData){
            return {
                version: rawData['dist-tags'].latest, //version,
                versions: Object.keys(rawData.versions),
                homepage: bestGuessHomepage(rawData)
            };

        }, function(err){console.log('Error from registry: ' + packageName, err.message); });
}

module.exports = getNpmInfo;
