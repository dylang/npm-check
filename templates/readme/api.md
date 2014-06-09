## API

The API is here in case you want to wrap this with your CI toolset. It should not be considered stable. 
For example, I'll probably rename a bunch of these to make more sense.

```js
var npmCheck = require('npm-check');

npmCheck(path)
  .then(result);
```

### `npmCheck(path)` returns `promise`

`result` looks like this:

`object of module names : data`

`data` looks like this:

About the module

* moduleName: name of the module.
* homepage: url to the home page.

Versions

* latest: latest according to the registry.
* installed: version in node_modules.
* packageJson: version or range in package.json.
* devDependency: Is this a devDependency?
* usedInScripts: Is this used in the scripts section of package.json?
* mismatch: Is the version installed not match the range in package.json?
* semver_validRange: Is the package.json range valid?
* semver_valid: Is the installed version valid semver?
* easy_upgrade: Will using npm install upgrade the module?
* bump: What kind of bump is required to get the latest, such as patch, minor, major.
* unused: Is this module used in the code?