import _ from 'lodash';
import semver from 'semver';
import packageJson from 'package-json';
import bestGuessHomepage from './best-guess-homepage';

const cpuCount = require('os').cpus().length;
const throat = require('throat')(cpuCount);

export default function getNpmInfo(packageName) {
  return throat(() => packageJson(packageName))
    .then((rawData) => {
      const CRAZY_HIGH_SEMVER = '8000.0.0';

      const sortedVersions = _(rawData.versions)
        .keys()
        .remove(_.partial(semver.gt, CRAZY_HIGH_SEMVER))
        .sort(semver.compare)
        .valueOf();

      const latest = rawData['dist-tags'].latest;
      const next = rawData['dist-tags'].next;
      const latestStableRelease = semver.satisfies(latest, '*')
        ? latest
        : semver.maxSatisfying(sortedVersions, '*');
      return {
        latest: latestStableRelease,
        next,
        versions: sortedVersions,
        homepage: bestGuessHomepage(rawData),
      };
    })
    .catch((err) => {
      const errorMessage = `Registry error ${err.message}`;
      return { error: errorMessage };
    });
}
