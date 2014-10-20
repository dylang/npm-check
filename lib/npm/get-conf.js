'use strict';

var q = require('q');
var RegistryClient = require('npm-registry-client');
var npmConf = require('npmconf');
var os = require('os');
var path = require('path');

function noop () {}
var noop_log = {
    error: noop,
    warn: noop,
    info: noop,
    verbose: noop,
    silly: noop,
    http: noop,
    pause: noop,
    resume: noop
};

function getConf() {
    var npmConfig = {
        log: noop_log
    };

    return q.nbind(npmConf.load, npmConf)(npmConfig);

}

function getGlobalNodeModulesPath() {
    return getConf()
        .then(function(conf) {
            var lib = os.platform() === 'win32' ? '' : 'lib';
            return path.resolve(conf.get('prefix'), lib);
        });
}

function getRegistry() {
    return getConf()
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
    getRegistry: getRegistry,
    getGlobalNodeModulesPath: getGlobalNodeModulesPath
};
