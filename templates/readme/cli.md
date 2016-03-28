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

<img width="882" alt="npm-check" src="https://cloud.githubusercontent.com/assets/51505/9569919/99c2412a-4f48-11e5-8c65-e9b6530ee991.png">

The result should look like the screenshot, or something nice when your packages are all up-to-date and in use.


### Options

```
    Usage
      $ npm-check <Options>

    Options
      -u, --update          Interactive update.
      -g, --global          Look at global modules.
      -s, --skip-unused     Skip check for unused packages.
      -p, --production      Ignore devDependencies.
      -d, --dir [path]      Directory to check, default is current directory.
      -c, --color           Force color output.
      -E, --save-exact      Save exact version instead of ^version.
      --no-emoji            Remove flair. Necessary for some terminals and CI envs.
      --debug               Debug output.

    Examples
      $ npm-check -g -u     # interactive update global deps
```


![npm-check-u](https://cloud.githubusercontent.com/assets/51505/9569912/8c600cd8-4f48-11e5-8757-9387a7a21316.gif)

#### -u, --update

Show an interactive UI for choosing which modules to update.

Automatically updates versions referenced in the `package.json`.

_Based on recommendations from the `npm` team, `npm-check` only updates using `npm install`, not `npm update`.
To avoid using more than one version of `npm` in one directory, `npm-check` will automatically install updated modules
using the version of `npm` installed globally._

<img width="669" alt="npm-check -g -u" src="https://cloud.githubusercontent.com/assets/51505/9569921/9ca3aeb0-4f48-11e5-95ab-6fdb88124007.png">

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

##### -E, --save-exact
  
Install packages using `--save-exact`, meaning exact versions will be saved in package.json.
 
Applies to both `dependencies` and `devDependencies`.

##### --color, --no-color
  
Enable or disable color support.

By default `npm-check` uses colors if they are available.

##### --emoji, --no-emoji
  
Enable or disable emoji support. Useful for terminals that don't support them. 
