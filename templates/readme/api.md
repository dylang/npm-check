## API

The API is here in case you want to wrap this with your CI toolset.

```js
var npmCheck = require('npm-check');

npmCheck(options)
  .then(result);
```

### `npmCheck(options)` returns `promise`

#### options

##### global `boolean`

* default is `false`

Use the globally installed packages. When `true`, the `path` is automatically set.

##### update `boolean`

* default is `false`

Interactive update.

##### skipUnused `boolean`

* default is `false`

Skip checking for unused packages.

##### ignoreDev `boolean`

* default is `false`

Ignore `devDependencies`.

##### path `string`

* default is `cwd`

Override where `npm-check` checks.

###### saveExact `boolean`
 
* default is `false`

Save exact versions to package.json

####`result`

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
* semverValidRange: Is the package.json range valid?
* semverValid: Is the installed version valid semver?
* easyUpgrade: Will using npm install upgrade the module?
* bump: What kind of bump is required to get the latest, such as patch, minor, major.
* unused: Is this module used in the code?