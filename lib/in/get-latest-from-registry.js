import _ from 'lodash';
import bestGuessHomepage from './best-guess-homepage.js';
import semver from 'semver';
import packageJson from 'package-json';
import {cpus} from 'os';
import throat0 from 'throat';

const cpuCount = cpus().length;
const throat = throat0(cpuCount);

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

export default getNpmInfo;
