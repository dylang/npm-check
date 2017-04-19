'use strict';

function skipUnused(currentState) {
    return currentState.get('skipUnused') ||           // manual option to ignore this
           currentState.get('global') ||               // global modules
           currentState.get('update') ||               // in the process of doing an update
           !currentState.get('cwdPackageJson').name;   // there's no package.json
}

module.exports = skipUnused;
