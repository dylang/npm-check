## npm-check  [![Build Status](http://img.shields.io/travis/dylang/npm-check.svg)](https://travis-ci.org/dylang/npm-check) [![npm-check](http://img.shields.io/npm/dm/npm-check.svg)](https://www.npmjs.org/package/npm-check)

> 检查需要更新的、不正确的、以及无用的 npm 依赖模块。

[English](/README.md) | [简体中文](/README.zh.sim.md) | [繁體中文](/README.zh.tra.md)

<img width="796" alt="npm-check -u" src="https://cloud.githubusercontent.com/assets/51505/9569917/96947fea-4f48-11e5-9783-2d78077256f2.png">

### 优秀之处

* 告诉你哪些依赖模块需要更新
* 为每一个模块提供更新的说明连接，来让你能够更好的决定是否需要更新它
* 如果一个依赖模块不再被使用了，它会在合适的时候提醒你
* 通过在命令中添加`-g`参数来检测全局所有已安装的依赖模块
* 通过`-u`参数进入一个无需输入命令行、也不会因为打错字母而浪费时间的**交互更新**界面
* 支持公开的或私有的[@依赖模块](https://docs.npmjs.com/getting-started/scoped-packages)
* 支持 ES6-style [`import from`](http://exploringjs.com/es6/ch_modules.html) 语法
* 利用你当前版本的 npm 来更新所有模块，包括更新 `npm` 自己，因此每个模块都会被安装到它们应当去的地方
* 支持所有的公开的 npm 模块，私有模块，以及像[Sinopia](https://github.com/rlidwka/sinopia)这样的备份模块
* 模块中 `pakage.json` 文件含有 `private: true` 时（私有模块），不会提示要求输入任何注册信息。
* 在你的命令行里显示表情符号，因为命令行有时候也可以变的很有趣
* 支持 `npm@2` 以及 `npm@3`，同时也支持最新流行的安装工具，像是 `ied` 和 `pnpm`

### 安装环境

* Node 版本不低于 0.11

### 使用命令行安装

这是安装 `npm-check` 最简单有效的方法。

### 安装

```bash
$ npm install -g npm-check
```

### 使用

```bash
$ npm-check
```

<img width="882" alt="npm-check" src="https://cloud.githubusercontent.com/assets/51505/9569919/99c2412a-4f48-11e5-8c65-e9b6530ee991.png">

在输入上面的命令行后，输出结果大概和这张截图上的样子差不多，如果所有的依赖模块都已经更新完毕并且在使用中，它会输出一个很棒的提示。

如果有需要更新的依赖模块，它会显示一段非零响应代码供你在 CI 中使用。

### Options  选项

```
Usage
  $ npm-check <path> <options>

Path
  查询路径默认是当前路径，使用 -g 参数来检测全局所有依赖模块。

Options
  -u, --update          交互式更新界面
  -g, --global           检查全局
  -s, --skip-unused     不检查不被使用的依赖模块
  -p, --production      跳过 devDependencies 类别
  -E, --save-exact      在 package.json 文件中保存指定的版本号(x.y.z)而不是插入(^x.y.z)
  --no-color            输出时不显示颜色
  --no-emoji            输出时不显示表情符号。在 CI 环境中中默认不显示表情符号
  --debug               输出 Debug，你可以用它来提交 issue

例子
  $ npm-check           # 检查有哪些模块可以更新，有哪些模块不被使用了
  $ npm-check ../foo    # 检查另一个路径
  $ npm-check -gu       # 检查全局所有模块
```

![npm-check-u](https://cloud.githubusercontent.com/assets/51505/9569912/8c600cd8-4f48-11e5-8757-9387a7a21316.gif)

#### `-u, --update`

提供一个可供选择更新模块的 UI 交互界面。

默认引用 `package.json` 中的版本号。

_根据 `npm` 团队的建议， `npm-check` 只使用 `npm install` 命令来进行更新，而不是 `npm update` 命令。
为了避免出现在同一个目录下使用多个版本的 `npm` 这种情况， `npm-check` 默认使用全局配置的 `npm` 版本来进行模块的更新安装。_

<img width="669" alt="npm-check -g -u" src="https://cloud.githubusercontent.com/assets/51505/9569921/9ca3aeb0-4f48-11e5-95ab-6fdb88124007.png">

##### 通过 [ied](https://github.com/alexanderGugel/ied) or [pnpm](https://github.com/rstacruz/pnpm) 来安装更新

为你想使用的安装工具设置 `NPM_CHECK_INSTALLER` 环境变量。

```bash
NPM_CHECK_INSTALLER=pnpm npm-check -u
## pnpm install --save-dev foo@version --color=always
```

同时你也可以在试运行测试中使用 `npm-check`

```bash
NPM_CHECK_INSTALLER=echo npm-check -u
```

#### `-g, --global`

检查全局所有的模块更新。

_提示：使用 `npm-check -u -g` 命令行进入一个安全的全局模块更新交互界面，接下来你甚至可以在其中更新 `npm` 自己。_

#### `-s, --skip-unused`

`npm-check` 默认显示已经不再使用的模块，添加这个参数后会不再提示所有不再使用的模块。

但在使用 `-g` 或 `-u` 参数时，也不会显示不再使用的模块。

#### `-p, --production`

`npm-check` 默认检测 `dependencies` 以及 `devDependencies` 类别下的模块，添加这个参数后会忽略所有 `devDependencies` 类别下需要更新或不再使用的模块。

#### `-E, --save-exact`

在安装依赖模块时使用 `--save-exact` 选项意味着在 package.json 文件中写入指定的版本号。
这个选项同时支持 `dependencies` 以及 `devDependencies` 类别下的模块。

#### `--color, --no-color`

显示／不显示输出颜色。
`npm-check` 默认在允许的情况下显示颜色。

#### `--emoji, --no-emoji`

显示／不显示表情符号，这个选项在不支持表情符号的终端里非常有用。
CI 环境下默认不显示表情符号。

#### `--spinner, --no-spinner`

显示／不显示动画效果，这个选项在不支持动画效果的终端里非常有用。
CI 环境下默认不显示动画效果。

### API

为了方便你将 `npm-check` 添加到你的 CI 工具配置中，下面是 API ：

```js
const npmCheck = require('npm-check');

npmCheck(options)
  .then(currentState => console.log(currentState.get('packages')));
```

#### `global`

* 检查全局模块
* 默认关闭
* `cwd` 默认开启这个选项

#### `update`

* 检查更新
* 默认关闭

#### `skipUnused`

* 忽略不再使用的模块
* 默认关闭

#### `ignoreDev`

* 忽略 `devDependencies` 类别
* 这个选项在命令行中的参数是 `--production`
* 默认关闭

#### `cwd`

* 覆盖 `npm-check` 检查路径
* 默认 `process.cwd()`

#### `saveExact`

* 使用指定版本号来写入 `package.json` 文件而不是 `^x.y.z`
* 默认关闭

#### `currentState`

这是一个得到 `当前状态` 的选项，可以在 [state.js](https://github.com/dylang/npm-check/blob/master/lib/util/state.js) 查看更多内容。

你可以通过 `currentState.get('packages')` 输出一个列表，通过它来查看模块的当前状态。

列表看起来会像下面这样：

```js
{
  moduleName: 'lodash',                 // 模块名称
  homepage: 'https://lodash.com/',      // 主页地址
  regError: undefined,                  // 读取注册表错误
  pkgError: undefined,                  // 读取 package.json 文件出现错误 
  latest: '4.7.0',                      // 最新版本
  installed: '4.6.1',                   // 已安装版本
  isInstalled: true,                    // 是否已经安装？
  notInstalled: false,                  // 是否没有安装？
  packageWanted: '4.7.0',               //  package.json 需要的版本
  packageJson: '^4.6.1',                // 上级 package.json 需要的版本
  devDependency: false,                 // 是否属于 devDependency 
  usedInScripts: undefined,             // 这个模块使用了 package.json 文件中哪些其它脚本 
  mismatch: false,                      // 已安装的版本是否和 package.json 文件中的不一致？
  semverValid: '4.6.1',                 // 已安装的版本是否符合语义化版本规则（SemVer）？
  easyUpgrade: true,                    // 在仅使用 `npm install` 命令的情况下，是否能够对这个模块进行更新？
  bump: 'minor',                        // 在得到最新版本时，需要哪种 bump？ 比如 patch, minor, major。
  unused: false                         // 这个模块是否不再使用了？
},
```

在命令行中添加 `--debug` 参数，你也能看到这些。

### 制作 `npm-check` 的原因

* [npm outdated](https://www.npmjs.org/doc/cli/npm-outdated.html) - 奇怪的输出，需要执行 `--depth=0` 选项才能进行交互。
* [david](https://github.com/alanshaw/david) - 不支持私有模块。
* [update-notifier](https://github.com/yeoman/update-notifier) - 只支持单一模块，而不是 `package.json` 文件中的所有模块。
* [depcheck](https://github.com/rumpl/depcheck) - 未完待续的不全面工程， `npm-check` 使用了部分 `depcheck` 内容进行开发。

### 关于作者

Hi! 很高兴你能够看到我的这个项目！我叫**Dylan Greene**。在没有被我的两个小孩子折腾的时候，我很享受为开源社区贡献代码。我也是[Opower](http://opower.com)的一名技术总监。[![@dylang](https://img.shields.io/badge/github-dylang-green.svg)](https://github.com/dylang) [![@dylang](https://img.shields.io/badge/twitter-dylang-blue.svg)](https://twitter.com/dylang)

下面是我的一些其它关于 Node 的项目：

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

_这个列表使用 [anthology](https://github.com/dylang/anthology) 制作。_


### License  使用证书

作者及贡献者保留一切权利。

通过 [MIT](https://tldrlegal.com/license/mit-license) 协议进行散布。

图片通过 [CC BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) (Attribution-ShareAlike) 协议进行授权。

***

_使用 [grunt-readme](https://github.com/assemble/grunt-readme) 以及 [grunt-templates-dylang](https://github.com/dylang/grunt-templates-dylang) 写于 2016 年 4 月 7 日。_

_如果你想改进这份说明，可以看看 `/templates/readme/` 这个目录。_

***

中文翻译：[Benjamin](https://twitter.com/itisbenjamin1)  
水平有限，如有能力，更建议看英文原版。  
欢迎纠正任何错误。  

