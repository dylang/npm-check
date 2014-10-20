## On the command line

This is how you should use `npm-check`. 

### Install


```bash
$ npm install -g npm-check
```

### Use


```bash
$ npm-check
```

The result should look like the screenshot, or something nice when your packages are all up-to-date and in use.


### Options

```
$ npm-check --help

  Usage: npm-check [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -u, --update       Interactive update.
    -g, --global       Look at global modules.
    -s, --skip-unused  Skip check for unused packages.
    -p, --production   Ignore devDependencies.
```

#### -u, --update

![npm-check-u2](https://cloud.githubusercontent.com/assets/51505/4696185/7e9a62ae-57e8-11e4-8bdb-3bb74bb6877d.gif)

Show an interactive UI for choosing which modules to update.

Automatically updates versions referenced in the `package.json`.

_Based on recommendations from the `npm` team, `npm-check` only updates using `npm install`, not `npm update`.
To avoid using more than one version of `npm` in one directory, `npm-check` will automatically install updated modules
using the version of `npm` installed globally._

#### -g, --global

Check the versions of your globally installed packages.

_Tip: Use `npm-check -u -g` to do a safe interactive update of global modules, including npm itself._

#### -s, --skip-unused

By default `npm-check` will let you know if any of your modules are not being used by looking at `require` statements
in your code.

This option will skip that check.

This is enabled by default when using `global` or `update`.

#### -p, --production

By default `npm-check` will look at packages listed as `dependencies` and `devDependencies`.

This option will let it ignore outdated and unused checks for packages listed as `devDependencies`.
