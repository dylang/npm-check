## npm-check [![NPM version](https://badge.fury.io/js/npm-check.png)](http://badge.fury.io/js/npm-check)  [![Build Status](https://travis-ci.org/dylang/npm-check.png)](https://travis-ci.org/dylang/npm-check) 

> Check for outdated, incorrect, and unused dependencies.

[![npm-check](https://nodei.co/npm/npm-check.png?downloads=true "npm-check")](https://nodei.co/npm/npm-check)


![npm-check](https://cloud.githubusercontent.com/assets/51505/3213203/c1cab104-ef84-11e3-9e5c-6e2bfdd1a558.png "npm-check")





### CLI

This is how you should use `npm-check`. 

#### Install


```bash
$ npm install -g npm-check
```

#### Use


```bash
$ npm-check
```

The result should look like the screenshot, or something nice when your packages are all up-to-date and in use.


#### Options

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

##### -u, --update

![npm-check-u2](https://cloud.githubusercontent.com/assets/51505/4696185/7e9a62ae-57e8-11e4-8bdb-3bb74bb6877d.gif)

Show an interactive UI for choosing which modules to update.

Automatically updates versions referenced in the `package.json`.

_Based on recommendations from the `npm` team, `npm-check` only updates using `npm install`, not `npm update`.
To avoid using more than one version of `npm` in one directory, `npm-check` will automatically install updated modules
using the version of `npm` installed globally._

##### -g, --global

Check the versions of your globally installed packages.

_Tip: Use `npm-check -u -g` to do a safe interactive update of global modules, including npm itself._

##### -s, --skip-unused

By default `npm-check` will let you know if any of your modules are not being used by looking at `require` statements
in your code.

This option will skip that check.

This is enabled by default when using `global` or `update`.

##### -p, --production

By default `npm-check` will look at packages listed as `dependencies` and `devDependencies`.

This option will let it ignore outdated and unused checks for packages listed as `devDependencies`.



### API

The API is here in case you want to wrap this with your CI toolset.

```js
var npmCheck = require('npm-check');

npmCheck(options)
  .then(result);
```

#### `npmCheck(options)` returns `promise`

##### options

###### global `boolean`

* default is `false`

Use the globally installed packages. When `true`, the `path` is automatically set.

###### update `boolean`

* default is `false`

Interactive update.

###### skipUnused `boolean`

* default is `false`

Skip checking for unused packages.

###### ignoreDev `boolean`

* default is `false`

Ignore `devDependencies`.

###### path `string`

* default is `cwd`

Override where `npm-check` checks.

#####`result`

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


### Inspiration

* [npm outdated](https://www.npmjs.org/doc/cli/npm-outdated.html) - awkward output, requires --depth=0 to be grokable.
* [david](https://github.com/alanshaw/david) - does not work with private registries.
* [update-notifier](https://github.com/yeoman/update-notifier) - for single modules, not everything in package.json.
* [depcheck](https://github.com/rumpl/depcheck) - only part of the puzzle. npm-check uses depcheck.





### About the Author

Hello fellow developer! My name is [Dylan Greene](https://github.com/dylang). When
not overwhelmed with my two kids I enjoy contributing to the open source community.
I'm a tech lead at [Opower](http://opower.com). I lead a team using Grunt and Angular to build software that
successfully helps people like us use less power.
Not too long ago I co-created [Doodle or Die](http://doodleordie.com), a hilarious web game with millions of
doodles that won us Node Knockout for the "most fun" category.
I'm [dylang](https://twitter.com/dylang) on Twitter and other places.

Some of my other Node projects:

| Name | Description | Github Stars | Npm Installs |
|---|---|--:|--:|
| [`grunt-notify`](https://github.com/dylang/grunt-notify) | Automatic desktop notifications for Grunt errors and warnings using Growl for OS X or Windows, Mountain Lion and Mavericks Notification Center, and Notify-Send. | 810 | 40,789 |
| [`grunt-prompt`](https://github.com/dylang/grunt-prompt) | Interactive prompt for your Grunt config using console checkboxes, text input with filtering, password fields. | 249 | 6,797 |
| [`shortid`](https://github.com/dylang/shortid) | Amazingly short non-sequential url-friendly unique id generator. | 268 | 10,622 |
| [`rss`](https://github.com/dylang/node-rss) | RSS feed generator. A really simple API to add RSS feeds to any project. | 247 | 16,033 |
| [`xml`](https://github.com/dylang/node-xml) | Fast and simple xml generator. Supports attributes, CDATA, etc. Includes tests and examples. | 57 | 22,127 |
| [`changelog`](https://github.com/dylang/changelog) | Command line tool (and Node module) that generates a changelog in color output, markdown, or json for modules in npmjs.org's registry as well as any public github.com repo. | 61 | 315 |
| [`grunt-attention`](https://github.com/dylang/grunt-attention) | Display attention-grabbing messages in the terminal | _New!_ | 7,616 |
| [`logging`](https://github.com/dylang/logging) | Super sexy color console logging with cluster support. | 24 | 241 |
| [`observatory`](https://github.com/dylang/observatory) | Beautiful UI for showing tasks running on the command line. | 31 | 6,392 |
| [`flowdock-refined`](https://github.com/dylang/flowdock-refined) | Flowdock desktop app custom UI | _New!_ | 49 |
| [`anthology`](https://github.com/dylang/anthology) | Module information and stats for any @npmjs user | _New!_ | 240 |
| [`grunt-cat`](https://github.com/dylang/grunt-cat) | Echo a file to the terminal. Works with text, figlets, ascii art, and full-color ansi. | _New!_ | 212 |

_This list was generated using [anthology](https://github.com/dylang/anthology)._


### License
Copyright (c) 2014 Dylan Greene, contributors.

Released under the [MIT license](https://tldrlegal.com/license/mit-license).

Screenshots are [CC BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) (Attribution-ShareAlike).

***
_Generated using [grunt-readme](https://github.com/assemble/grunt-readme) with [grunt-templates-dylang](https://github.com/dylang/grunt-templates-dylang) on Sunday, October 19, 2014._ [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dylang/npm-check/trend.png)](https://bitdeli.com/free "Bitdeli Badge") [![Google Analytics](https://ga-beacon.appspot.com/UA-4820261-3/dylang/npm-check)](https://github.com/igrigorik/ga-beacon)

