'use strict';

const gitUrl = require('giturl');

function bestGuessHomepage(data) {
    if (!data) {
        return false;
    }

    const packageDataForLatest = data.versions[data['dist-tags'].latest];

    return packageDataForLatest.homepage ||
        packageDataForLatest.bugs && packageDataForLatest.bugs.url && gitUrl.parse(packageDataForLatest.bugs.url.trim()) ||
        packageDataForLatest.repository && packageDataForLatest.repository.url && gitUrl.parse(packageDataForLatest.repository.url.trim());
}

module.exports = bestGuessHomepage;
