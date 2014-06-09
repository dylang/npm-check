'use strict';

var _ = require('lodash');
var getRegistry = _.memoize(require('./get-registry').getRegistry); //Mock
var bestGuessHomepage = require('./../util/best-guess-homepage');

function getNpmInfo(packageName){
    var getPath = packageName + '/latest';

    return getRegistry()
        .then(function(registry) {
            return registry.client(registry.url + getPath, {}); // , 1, true, true for mocking
        })
        .spread(function(rawData){
            return {
                version: rawData.version,
                homepage: bestGuessHomepage(rawData)
            };

        }, function(err){console.log('Error from registry: ' + packageName, err.message); });
}

module.exports = getNpmInfo;
