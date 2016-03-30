'use strict';

const gitUrl = require('giturl');

function bestGuessHomepage(data) {
    if (!data) {
        return false;
    }

    const packageDataForLatest = data.versions[data['dist-tags'].latest];

    return packageDataForLatest.homepage ||
        packageDataForLatest.bugs && gitUrl.parse(packageDataForLatest.bugs.url) ||
        packageDataForLatest.repository && gitUrl.parse(packageDataForLatest.repository.url);
}

module.exports = bestGuessHomepage;
