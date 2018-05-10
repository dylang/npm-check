npm-check
=========
[![Build Status](https://travis-ci.org/dylang/npm-check.svg?branch=master)](https://travis-ci.org/dylang/npm-check)
[![NPM version](https://badge.fury.io/js/npm-check.svg)](http://badge.fury.io/js/npm-check)
[![Dependency Status](https://img.shields.io/david/dylang/npm-check.svg)](https://david-dm.org/dylang/npm-check)
[![npm](https://img.shields.io/npm/dm/npm-check.svg?maxAge=2592000)]()

> Check for outdated, incorrect, and unused dependencies.

<img width="796" alt="npm-check -u" src="https://cloud.githubusercontent.com/assets/51505/9569917/96947fea-4f48-11e5-9783-2d78077256f2.png">

### Features

* Tells you what's out of date.
* Provides a link to the package's documentation so you can decide if you want the update.
* Kindly informs you if a dependency is not being used in your code.
* Works on your globally installed packages too, via `-g`.
* **Interactive Update** for less typing and fewer typos, via `-u`.
* Supports public and private [@scoped/packages](https://docs.npmjs.com/getting-started/scoped-packages).
* Supports ES6-style [`import from`](http://exploringjs.com/es6/ch_modules.html) syntax.
* Upgrades your modules using your installed version of npm, including the new `npm@3`, so dependencies go where you expect them.
* Works with any public npm registry, [private registries](https://www.npmjs.com/enterprise), and alternate registries like [Sinopia](https://github.com/rlidwka/sinopia).
* Does not query registries for packages with `private: true` in their package.json.
* Emoji in a command-line app, because command-line apps can be fun too.
* Works with `npm@2` and `npm@3`, as well as newer alternative installers like `ied` and `pnpm`.

### Requirements
* Node >= 0.11.

### On the command line

This is the easiest way to use `npm-check`.

### Install
```bash
$ npm install -g npm-check
```

### Use
```bash
$ npm-check
```

<img width="882" alt="npm-check" src="https://cloud.githubusercontent.com/assets/51505/9569919/99c2412a-4f48-11e5-8c65-e9b6530ee991.png">

The result should look like the screenshot, or something nice when your packages are all up-to-date and in use.

When updates are required it will return a non-zero response code that you can use in your CI tools.

### Options

```
Usage
  $ npm-check <path> <options>

Path
  Where to check. Defaults to current directory. Use -g for checking global modules.

Options
  -u, --update          Interactive update.
  -y, --update-all      Uninteractive update. Apply all updates without prompting.
  -g, --global          Look at global modules.
  -s, --skip-unused     Skip check for unused packages.
  -p, --production      Skip devDependencies.
  -d, --dev-only        Look at devDependencies only (skip dependencies).
  -i, --ignore          Ignore dependencies based on succeeding glob.
  -E, --save-exact      Save exact version (x.y.z) instead of caret (^x.y.z) in package.json.
  --specials            List of depcheck specials to include in check for unused dependencies.
  --no-color            Force or disable color output.
  --no-emoji            Remove emoji support. No emoji in default in CI environments.
  --debug               Show debug output. Throw in a gist when creating issues on github.

Examples
  $ npm-check           # See what can be updated, what isn't being used.
  $ npm-check ../foo    # Check another path.
  $ npm-check -gu       # Update globally installed modules by picking which ones to upgrade.
```

![npm-check-u](https://cloud.githubusercontent.com/assets/51505/9569912/8c600cd8-4f48-11e5-8757-9387a7a21316.gif)

#### `-u, --update`

Show an interactive UI for choosing which modules to update.

Automatically updates versions referenced in the `package.json`.

_Based on recommendations from the `npm` team, `npm-check` only updates using `npm install`, not `npm update`.
To avoid using more than one version of `npm` in one directory, `npm-check` will automatically install updated modules
using the version of `npm` installed globally._

<img width="669" alt="npm-check -g -u" src="https://cloud.githubusercontent.com/assets/51505/9569921/9ca3aeb0-4f48-11e5-95ab-6fdb88124007.png">

##### Update using [ied](https://github.com/alexanderGugel/ied) or [pnpm](https://github.com/rstacruz/pnpm)

Set environment variable `NPM_CHECK_INSTALLER` to the name of the installer you wish to use.

```bash
NPM_CHECK_INSTALLER=pnpm npm-check -u
## pnpm install --save-dev foo@version --color=always
```

You can also use this for dry-run testing:

```bash
NPM_CHECK_INSTALLER=echo npm-check -u
```

#### `-y, --update-all`

Updates your dependencies like `--update`, just without any prompt. This is especially useful if you want to automate your dependency updates with `npm-check`.

#### `-g, --global`

Check the versions of your globally installed packages.

If the value of `process.env.NODE_PATH` is set, it will override the default path of global node_modules returned by package [`global-modules`](https://www.npmjs.com/package/global-modules).

_Tip: Use `npm-check -u -g` to do a safe interactive update of global modules, including npm itself._

#### `-s, --skip-unused`

By default `npm-check` will let you know if any of your modules are not being used by looking at `require` statements
in your code.

This option will skip that check.

This is enabled by default when using `global` or `update`.

#### `-p, --production`

By default `npm-check` will look at packages listed as `dependencies` and `devDependencies`.

This option will let it ignore outdated and unused checks for packages listed as `devDependencies`.

#### `-d, --dev-only`

Ignore `dependencies` and only check `devDependencies`.

This option will let it ignore outdated and unused checks for packages listed as `dependencies`.

#### `-i, --ignore`

Ignore dependencies that match specified glob.

`$ npm-check -i babel-*` will ignore all dependencies starting with 'babel-'.

#### `-E, --save-exact`

Install packages using `--save-exact`, meaning exact versions will be saved in package.json.

Applies to both `dependencies` and `devDependencies`.

#### `--specials`

Check special (e.g. config) files when looking for unused dependencies.

`$ npm-check --specials=bin,webpack` will look in the `scripts` section of package.json and in webpack config.

See [https://github.com/depcheck/depcheck#special](https://github.com/depcheck/depcheck#special) for more information.

#### `--color, --no-color`

Enable or disable color support.

By default `npm-check` uses colors if they are available.

#### `--emoji, --no-emoji`

Enable or disable emoji support. Useful for terminals that don't support them. Automatically disabled in CI servers.

#### `--spinner, --no-spinner`

Enable or disable the spinner. Useful for terminals that don't support them. Automatically disabled in CI servers.

### API

The API is here in case you want to wrap this with your CI toolset.

```js
const npmCheck = require('npm-check');

npmCheck(options)
  .then(currentState => console.log(currentState.get('packages')));
```

#### `update`

* Interactive update.
* default is `false`

#### `global`

* Check global modules.
* default is `false`
* `cwd` is automatically set with this option.

#### `skipUnused`

* Skip checking for unused packages.
* default is `false`

#### `ignoreDev`

* Ignore `devDependencies`.
* This is called `--production` on the command line to match `npm`.
* default is `false`

#### `devOnly`

* Ignore `dependencies` and only check `devDependencies`.
* default is `false`

#### `ignore`

* Ignore dependencies that match specified glob.
* default is `[]`

#### `saveExact`

* Update package.json with exact version `x.y.z`  instead of semver range `^x.y.z`.
* default is `false`

#### `debug`

* Show debug output. Throw in a gist when creating issues on github.
* default is `false`

#### `cwd`

* Override where `npm-check` checks.
* default is `process.cwd()`

#### `specials`

* List of [`depcheck`](https://github.com/depcheck/depcheck) special parsers to include.
* default is `''`

#### `currentState`

The result of the promise is a `currentState` object, look in [state.js](lib/state/state.js) to see how it works.

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

### Inspiration

* [npm outdated](https://www.npmjs.com/doc/cli/npm-outdated.html) - awkward output, requires --depth=0 to be grokable.
* [david](https://github.com/alanshaw/david) - does not work with private registries.
* [update-notifier](https://github.com/yeoman/update-notifier) - for single modules, not everything in package.json.
* [depcheck](https://github.com/depcheck/depcheck) - only part of the puzzle. npm-check uses depcheck.

### About the Author

Hi! Thanks for checking out this project! My name is **Dylan Greene**. When not overwhelmed with my two young kids I enjoy contributing
to the open source community. I'm also a tech lead at [Opower](https://opower.com/). [![@dylang](https://img.shields.io/badge/github-dylang-green.svg)](https://github.com/dylang) [![@dylang](https://img.shields.io/badge/twitter-dylang-blue.svg)](https://twitter.com/dylang)

Here's some of my other Node projects:

| Name | Description | npm&nbsp;Downloads |
|---|---|---|
| [`grunt‑notify`](https://github.com/dylang/grunt-notify) | Automatic desktop notifications for Grunt errors and warnings. Supports OS X, Windows, Linux. | [![grunt-notify](https://img.shields.io/npm/dm/grunt-notify.svg?style=flat-square)](https://www.npmjs.org/package/grunt-notify) |
| [`shortid`](https://github.com/dylang/shortid) | Amazingly short non-sequential url-friendly unique id generator. | [![shortid](https://img.shields.io/npm/dm/shortid.svg?style=flat-square)](https://www.npmjs.org/package/shortid) |
| [`space‑hogs`](https://github.com/dylang/space-hogs) | Discover surprisingly large directories from the command line. | [![space-hogs](https://img.shields.io/npm/dm/space-hogs.svg?style=flat-square)](https://www.npmjs.org/package/space-hogs) |
| [`rss`](https://github.com/dylang/node-rss) | RSS feed generator. Add RSS feeds to any project. Supports enclosures and GeoRSS. | [![rss](https://img.shields.io/npm/dm/rss.svg?style=flat-square)](https://www.npmjs.org/package/rss) |
| [`grunt‑prompt`](https://github.com/dylang/grunt-prompt) | Interactive prompt for your Grunt config using console checkboxes, text input with filtering, password fields. | [![grunt-prompt](https://img.shields.io/npm/dm/grunt-prompt.svg?style=flat-square)](https://www.npmjs.org/package/grunt-prompt) |
| [`xml`](https://github.com/dylang/node-xml) | Fast and simple xml generator. Supports attributes, CDATA, etc. Includes tests and examples. | [![xml](https://img.shields.io/npm/dm/xml.svg?style=flat-square)](https://www.npmjs.org/package/xml) |
| [`changelog`](https://github.com/dylang/changelog) | Command line tool (and Node module) that generates a changelog in color output, markdown, or json for modules in npmjs.org's registry as well as any public github.com repo. | [![changelog](https://img.shields.io/npm/dm/changelog.svg?style=flat-square)](https://www.npmjs.org/package/changelog) |
| [`grunt‑attention`](https://github.com/dylang/grunt-attention) | Display attention-grabbing messages in the terminal | [![grunt-attention](https://img.shields.io/npm/dm/grunt-attention.svg?style=flat-square)](https://www.npmjs.org/package/grunt-attention) |
| [`observatory`](https://github.com/dylang/observatory) | Beautiful UI for showing tasks running on the command line. | [![observatory](https://img.shields.io/npm/dm/observatory.svg?style=flat-square)](https://www.npmjs.org/package/observatory) |
| [`anthology`](https://github.com/dylang/anthology) | Module information and stats for any @npmjs user | [![anthology](https://img.shields.io/npm/dm/anthology.svg?style=flat-square)](https://www.npmjs.org/package/anthology) |
| [`grunt‑cat`](https://github.com/dylang/grunt-cat) | Echo a file to the terminal. Works with text, figlets, ascii art, and full-color ansi. | [![grunt-cat](https://img.shields.io/npm/dm/grunt-cat.svg?style=flat-square)](https://www.npmjs.org/package/grunt-cat) |

_This list was generated using [anthology](https://github.com/dylang/anthology)._

### License
Copyright (c) 2016 Dylan Greene, contributors.

Released under the [MIT license](https://tldrlegal.com/license/mit-license).

Screenshots are [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/) (Attribution-ShareAlike).
