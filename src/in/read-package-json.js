import merge from 'merge-options';

export default function readPackageJson(filename) {
  let pkg;
  let error;

  try {
    pkg = require(filename);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      error = new Error(`A package.json was not found at ${filename}`);
    } else {
      error = new Error(
        `A package.json was found at ${filename}, but it is not valid.`,
      );
    }
  }
  return merge(pkg, { devDependencies: {}, dependencies: {}, error });
}
