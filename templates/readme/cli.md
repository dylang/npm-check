## On the command line

This is the easiest way to use `npm-check`.

## Install

```bash
$ npm install -g npm-check
```

## Use

```bash
$ npm-check
```

<img width="882" alt="npm-check" src="https://cloud.githubusercontent.com/assets/51505/9569919/99c2412a-4f48-11e5-8c65-e9b6530ee991.png">

The result should look like the screenshot, or something nice when your packages are all up-to-date and in use.

When updates are required it will return a non-zero response code that you can use in your CI tools.

## Options

```
Usage
  $ npm-check <path> <options>

Path
  Where to check. Defaults to current directory. Use -g for checking global modules.

Options
  -u, --update          Interactive update.
  -g, --global          Look at global modules.
  -s, --skip-unused     Skip check for unused packages.
  -p, --production      Skip devDependencies.
  -i, --ignore          Ignore dependencies based on succeeding glob.
  -E, --save-exact      Save exact version (x.y.z) instead of caret (^x.y.z) in package.json.
  --no-color            Force or disable color output.
  --no-emoji            Remove emoji support. No emoji in default in CI environments.
  --debug               Debug output. Throw in a gist when creating issues on github.

Examples
  $ npm-check           # See what can be updated, what isn't being used.
  $ npm-check ../foo    # Check another path.
  $ npm-check -gu       # Update globally installed modules by picking which ones to upgrade.
```

![npm-check-u](https://cloud.githubusercontent.com/assets/51505/9569912/8c600cd8-4f48-11e5-8757-9387a7a21316.gif)

### `-u, --update`

Show an interactive UI for choosing which modules to update.

Automatically updates versions referenced in the `package.json`.

_Based on recommendations from the `npm` team, `npm-check` only updates using `npm install`, not `npm update`.
To avoid using more than one version of `npm` in one directory, `npm-check` will automatically install updated modules
using the version of `npm` installed globally._

<img width="669" alt="npm-check -g -u" src="https://cloud.githubusercontent.com/assets/51505/9569921/9ca3aeb0-4f48-11e5-95ab-6fdb88124007.png">

#### Update using [ied](https://github.com/alexanderGugel/ied) or [pnpm](https://github.com/rstacruz/pnpm)

Set environment variable `NPM_CHECK_INSTALLER` to the name of the installer you wish to use.

```bash
NPM_CHECK_INSTALLER=pnpm npm-check -u
# pnpm install --save-dev foo@version --color=always
```

You can also use this for dry-run testing:

```bash
NPM_CHECK_INSTALLER=echo npm-check -u
```

### `-g, --global`

Check the versions of your globally installed packages.

_Tip: Use `npm-check -u -g` to do a safe interactive update of global modules, including npm itself._

### `-s, --skip-unused`

By default `npm-check` will let you know if any of your modules are not being used by looking at `require` statements
in your code.

This option will skip that check.

This is enabled by default when using `global` or `update`.

### `-p, --production`

By default `npm-check` will look at packages listed as `dependencies` and `devDependencies`.

This option will let it ignore outdated and unused checks for packages listed as `devDependencies`.

#### `-i, --ignore`

Ignore dependencies that match specified glob.

`$ npm-check -i babel-*` will ignore all dependencies starting with 'babel-'.

### `-E, --save-exact`

Install packages using `--save-exact`, meaning exact versions will be saved in package.json.

Applies to both `dependencies` and `devDependencies`.

### `--color, --no-color`

Enable or disable color support.

By default `npm-check` uses colors if they are available.

### `--emoji, --no-emoji`

Enable or disable emoji support. Useful for terminals that don't support them. Automatically disabled in CI servers.

### `--spinner, --no-spinner`

Enable or disable the spinner. Useful for terminals that don't support them. Automatically disabled in CI servers.
