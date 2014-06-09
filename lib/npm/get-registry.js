'use strict';

var q = require('q');
var RegistryClient = require('npm-registry-client');
var npmConf = require('npmconf');

q.longStackSupport = true;

function noop () {}
var noop_log = { error: noop, warn: noop, info: noop,
                     verbose: noop, silly: noop, http: noop,
                     pause: noop, resume: noop };

function getRegistry() {
    var npmConfig = {
        log: noop_log
    };

    return q.nbind(npmConf.load, npmConf)(npmConfig)
        .then(function(conf){

            var client = new RegistryClient(conf);
            return q.resolve(
                {
                    url: conf.get('registry'),
                    client: q.nbind(client.get, client)
                }
            );
        });
}

module.exports = {
    getRegistry: getRegistry
};
