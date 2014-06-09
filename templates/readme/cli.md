## CLI

This is how you should use `npm-check`. 

### Install


```bash
$ npm install -g npm-check
```

### Use

From any project directory that has a `package.json`:

```bash
$ npm-check
```

The result should look like the screenshot, or something nice when your packages are all up-to- and in use.


### Options

There are current no command-line options.

Possible options I might add soon:

* `-g` to scan globally installed packages for updates.
* `-v` for verbose mode.
* `--skip-unused` to skip the check for unused dependencies.
* `--skip-dev` to not look at dev dependencies.