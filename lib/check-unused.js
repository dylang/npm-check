var q = require('q');
var depcheck = require('depcheck');
var _ = require('lodash');

function checkUnused(dir){
    var defer = q.defer();

    if (!_.isFunction(depcheck)) {
        console.log('depcheck issues');
        console.log('typeof', typeof depcheck);
        console.log('keys', _.keys(depcheck));
        console.log('obj', depcheck);
        return;
    }

    depcheck(dir || process.cwd(), {}, function(unused) {
        return defer.resolve(unused);
    });
    return defer.promise;
}

module.exports = checkUnused;