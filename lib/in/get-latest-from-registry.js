'use strict';

const cpuCount = require('os').cpus().length;
const throat = require('throat')(cpuCount);

const _ = require('lodash');
const packageJson = require('package-json');
const semver = require('semver');
const bestGuessHomepage = require('./best-guess-homepage');

function getNpmInfo(packageName) {
    return throat(() => packageJson(packageName, {fullMetadata: true, allVersions: true}))
        .then(rawData => {
            const CRAZY_HIGH_SEMVER = '8000.0.0';

            const sortedVersions = _(rawData.versions)
                .keys()
                .remove(_.partial(semver.gt, CRAZY_HIGH_SEMVER))
                .sort(semver.compare)
                .valueOf();

            const {latest} = rawData['dist-tags'];
            const {next} = rawData['dist-tags'];
            const latestStableRelease = semver.satisfies(latest, '*') ?
                latest :
                semver.maxSatisfying(sortedVersions, '*');
            return {
                latest: latestStableRelease,
                next,
                versions: sortedVersions,
                homepage: bestGuessHomepage(rawData)
            };
        }).catch(error => {
            const errorMessage = `Registry error ${error.message}`;
            return {
                error: errorMessage
            };
        });
}

module.exports = getNpmInfo;
