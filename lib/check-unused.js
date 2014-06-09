var q = require('q');
var depcheck = require('depcheck');

function checkUnused(dir){
    var defer = q.defer();
    defer.notify('checkUnused start');
    depcheck(dir || process.cwd(), {}, function(unused) {
        defer.notify('checkUnused finish');
        return defer.resolve(unused);
    });
    return defer.promise;
}

module.exports = checkUnused;