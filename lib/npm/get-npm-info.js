'use strict';

var _ = require('lodash');
var getConf = _.memoize(require('./get-conf').getRegistry); //Mock
var bestGuessHomepage = require('./../util/best-guess-homepage');
var registryUrl = require('registry-url');

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
            return {
                version: rawData['dist-tags'].latest, //version,
                versions: Object.keys(rawData.versions),
                homepage: bestGuessHomepage(rawData)
            };

        }, function(err){
            var errorMessage = registryUrl + ' returned ' + err.message;
            console.log('Error from registry:', errorMessage);
            return { error:  errorMessage };
        });
}

module.exports = getNpmInfo;
