## API

The API is here in case you want to wrap this with your CI toolset.

```js
const npmCheck = require('npm-check');

npmCheck(options)
  .then(currentState => console.log(currentState.get('packages')));
```

### `global`

* Check global modules.
* default is `false`
* `cwd` is automatically set with this option.

### `update`

* Interactive update.
* default is `false`

### `skipUnused`

* Skip checking for unused packages.
* default is `false`

### `ignoreDev`

* Ignore `devDependencies`.
* This is called `--production` on the command line to match `npm`.
* default is `false`

### `cwd`

* Override where `npm-check` checks.
* default is `process.cwd()`

### `saveExact`

* Update package.json with exact version `x.y.z`  instead of semver range `^x.y.z`.
* default is `false`


### `currentState`

The result of the promise is a `currentState` object, look in [state.js](https://github.com/dylang/npm-check/blob/master/lib/util/state.js) to see how it works.

You will probably want `currentState.get('packages')` to get an array of packages and the state of each of them.

Each item in the array will look like the following:


```js
{
  moduleName: 'lodash',                 // name of the module.
  homepage: 'https://lodash.com/',      // url to the home page.
  regError: undefined,                  // error communicating with the registry
  pkgError: undefined,                  // error reading the package.json
  latest: '4.7.0',                      // latest according to the registry.
  installed: '4.6.1',                   // version installed
  isInstalled: true,                    // Is it installed?
  notInstalled: false,                  // Is it installed?
  packageWanted: '4.7.0',               // Requested version from the package.json.
  packageJson: '^4.6.1',                // Version or range requested in the parent package.json.
  devDependency: false,                 // Is this a devDependency?
  usedInScripts: undefined,             // Array of `scripts` in package.json that use this module.
  mismatch: false,                      // Does the version installed not match the range in package.json?
  semverValid: '4.6.1',                 // Is the installed version valid semver?
  easyUpgrade: true,                    // Will running just `npm install` upgrade the module?
  bump: 'minor',                        // What kind of bump is required to get the latest, such as patch, minor, major.
  unused: false                         // Is this module used in the code?
},
```

You will also see this if you use `--debug` on the command line.
