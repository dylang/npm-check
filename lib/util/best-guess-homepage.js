'use strict';

var gitUrl = require('giturl');

function bestGuessHomepage(data) {
    if (!data) {
        return false;
    }

    data = data.versions[data['dist-tags'].latest];

    return data.homepage ||
        data.bugs && gitUrl.parse(data.bugs.url) ||
        data.repository && gitUrl.parse(data.repository.url);
}

module.exports = bestGuessHomepage;
