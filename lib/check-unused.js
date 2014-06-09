var q = require('q');
var depcheck = require('../node_modules/depcheck/index'); //https://github.com/rumpl/depcheck/issues/5
var _ = require('lodash');

function checkUnused(dir){
    var defer = q.defer();

    depcheck(dir || process.cwd(), {}, function(unused) {
        return defer.resolve(unused);
    });
    return defer.promise;
}

module.exports = checkUnused;