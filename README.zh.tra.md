## npm-check  [![Build Status](http://img.shields.io/travis/dylang/npm-check.svg)](https://travis-ci.org/dylang/npm-check) [![npm-check](http://img.shields.io/npm/dm/npm-check.svg)](https://www.npmjs.org/package/npm-check)

> 檢查需要更新的、不正確的、以及無用的 npm 依賴模塊。

[English](/README.md) | [简体中文](/README.zh.sim.md) | [繁體中文](/README.zh.tra.md)

<img width="796" alt="npm-check -u" src="https://cloud.githubusercontent.com/assets/51505/9569917/96947fea-4f48-11e5-9783-2d78077256f2.png">

### 優秀之處

* 告訴你哪些依賴模塊需要更新
* 為每一個模塊提供更新的說明連接，來讓你能夠更好的決定是否需要更新它
* 如果一個依賴模塊不再被使用了，它會在合適的時候提醒你。
* 通過在命令中添加`-g`參數來檢測全局所有已安裝的依賴模塊
* 通過`-u`參數進入一個無需輸入命令行、也不會因為打錯字母而浪費時間的**交互更新**界面。
* 支持公開的或私有的[@依賴模塊](https://docs.npmjs.com/getting-started/scoped-packages)。
* 支持 ES6-style [`import from`](http://exploringjs.com/es6/ch_modules.html) 語法
* 利用你當前版本的 npm 來更新所有模塊，包括更新 `npm` 自己，因此每個模塊都會被安裝到它們應當去的地方。
* 支持所有的公開的 npm 模塊，私有模塊，以及像[Sinopia](https://github.com/rlidwka/sinopia)這樣的備份模塊。
* 模塊中 `pakage.json` 文件含有 `private: true` 時（私有模塊），不會提示要求輸入任何註冊信息。
* 在你的命令行裡顯示表情符號，因為命令行有時候也可以變的很有趣。
* 支持 `npm@2` 以及 `npm@3`，同時也支持最新流行的安裝工具，像是 `ied` 和 `pnpm`。

### 安裝環境

* Node 版本不低於 0.11

### 使用命令行安裝

這是安裝 `npm-check` 最簡單有效的方法。

### 安裝

```bash
$ npm install -g npm-check
```

### 使用

```bash
$ npm-check
```

<img width="882" alt="npm-check" src="https://cloud.githubusercontent.com/assets/51505/9569919/99c2412a-4f48-11e5-8c65-e9b6530ee991.png">

在輸入上面的命令行後，輸出結果大概和這張截圖上的樣子差不多，如果所有的依賴模塊都已經更新完畢並且在使用中，它會輸出一個很棒的提示。

如果有需要更新的依賴模塊，它會顯示一段非零響應代碼供你在 CI 中使用。

### Options  選項

```
Usage
  $ npm-check <path> <options>

Path
  查詢路徑默認是當前路徑，使用 -g 參數來檢測全局所有依賴模塊。

Options
  -u, --update          交互式更新界面
  -g, --global           檢查全局
  -s, --skip-unused     不檢查不被使用的依賴模塊
  -p, --production      跳過 devDependencies 類別
  -E, --save-exact      在 package.json 文件中保存指定的版本號(x.y.z)而不是插入(^x.y.z)
  --no-color            輸出時不顯示顏色
  --no-emoji            輸出時不顯示表情符號。在 CI 環境中中默認不顯示表情符號
  --debug               輸出 Debug，你可以用它來提交 issue

例子
  $ npm-check           # 檢查有哪些模塊可以更新，有哪些模塊不被使用了
  $ npm-check ../foo    # 檢查另一個路徑
  $ npm-check -gu       # 檢查全局所有模塊
```

![npm-check-u](https://cloud.githubusercontent.com/assets/51505/9569912/8c600cd8-4f48-11e5-8757-9387a7a21316.gif)

#### `-u, --update`

提供一個可供選擇更新模塊的 UI 交互界面。

默認引用 `package.json` 中的版本號。

_根據 `npm` 團隊的建議， `npm-check` 只使用 `npm install` 命令來進行更新，而不是 `npm update` 命令。
為了避免出現在同一個目錄下使用多個版本的 `npm` 這種情況， `npm-check` 默認使用全局配置的 `npm` 版本來進行模塊的更新安裝。_

<img width="669" alt="npm-check -g -u" src="https://cloud.githubusercontent.com/assets/51505/9569921/9ca3aeb0-4f48-11e5-95ab-6fdb88124007.png">

##### 通過 [ied](https://github.com/alexanderGugel/ied) or [pnpm](https://github.com/rstacruz/pnpm) 來安裝更新

為你想使用的安裝工具設置 `NPM_CHECK_INSTALLER` 環境變量。

```bash
NPM_CHECK_INSTALLER=pnpm npm-check -u
## pnpm install --save-dev foo@version --color=always
```

同時你也可以在試運行測試中使用 `npm-check`

```bash
NPM_CHECK_INSTALLER=echo npm-check -u
```

#### `-g, --global`

檢查全局所有的模塊更新。

_提示：使用 `npm-check -u -g` 命令行進入一個安全的全局模塊更新交互界面，接下來你甚至可以在其中更新 `npm` 自己。_

#### `-s, --skip-unused`

`npm-check` 默認顯示已經不再使用的模塊，添加這個參數後會不再提示所有不再使用的模塊。

但在使用 `-g` 或 `-u` 參數時，也不會顯示不再使用的模塊。

#### `-p, --production`

`npm-check` 默認檢測 `dependencies` 以及 `devDependencies` 類別下的模塊，添加這個參數後會忽略所有 `devDependencies` 類別下需要更新或不再使用的模塊。

#### `-E, --save-exact`

在安裝依賴模塊時使用 `--save-exact` 選項意味著在 package.json 文件中寫入指定的版本號。
這個選項同時支持 `dependencies` 以及 `devDependencies` 類別下的模塊。

#### `--color, --no-color`

顯示／不顯示輸出顏色。
`npm-check` 默認在允許的情況下顯示顏色。

#### `--emoji, --no-emoji`

顯示／不顯示表情符號，這個選項在不支持表情符號的終端里非常有用。
CI 環境下默認不顯示表情符號。

#### `--spinner, --no-spinner`

顯示／不顯示動畫效果，這個選項在不支持動畫效果的終端里非常有用。
CI 環境下默認不顯示動畫效果。

### API

為了方便你將 `npm-check` 添加到你的 CI 工具配置中，下面是 API ：

```js
const npmCheck = require('npm-check');

npmCheck(options)
  .then(currentState => console.log(currentState.get('packages')));
```

#### `global`

* 檢查全局模塊
* 默認關閉
* `cwd` 默認開啓這個選項

#### `update`

* 檢查更新
* 默認關閉

#### `skipUnused`

* 忽略不再使用的模塊
* 默認關閉

#### `ignoreDev`

* 忽略 `devDependencies` 類別
* 這個選項在命令行中的參數是 `--production`
* 默認關閉

#### `cwd`

* 覆蓋 `npm-check` 檢查路徑
* 默認 `process.cwd()`

#### `saveExact`

* 使用指定版本號來寫入 `package.json` 文件而不是 `^x.y.z`
* 默認關閉

#### `currentState`

這是一個得到 `當前狀態` 的選項，可以在 [state.js](https://github.com/dylang/npm-check/blob/master/lib/util/state.js) 查看更多內容。

你可以通過 `currentState.get('packages')` 輸出一個列表，通過它來查看模塊的當前狀態。

列表看起來會像下面這樣：

```js
{
  moduleName: 'lodash',                 // 模塊名稱
  homepage: 'https://lodash.com/',      // 主頁地址
  regError: undefined,                  // 讀取註冊表錯誤
  pkgError: undefined,                  // 讀取 package.json 文件出現錯誤 
  latest: '4.7.0',                      // 最新版本
  installed: '4.6.1',                   // 已安裝版本
  isInstalled: true,                    // 是否已經安裝？
  notInstalled: false,                  // 是否沒有安裝？
  packageWanted: '4.7.0',               //  package.json 需要的版本
  packageJson: '^4.6.1',                // 上級 package.json 需要的版本
  devDependency: false,                 // 是否屬於 devDependency 
  usedInScripts: undefined,             // 這個模塊使用了 package.json 文件中哪些其它腳本 
  mismatch: false,                      // 已安裝的版本是否和 package.json 文件中的不一致？
  semverValid: '4.6.1',                 // 已安裝的版本是否符合語義化版本規則（SemVer）？
  easyUpgrade: true,                    // 在僅使用 `npm install` 命令的情況下，是否能夠對這個模塊進行更新？
  bump: 'minor',                        // 在得到最新版本時，需要哪種 bump？ 比如 patch, minor, major。
  unused: false                         // 這個模塊是否不再使用了？
},
```

在命令行中添加 `--debug` 參數，你也能看到這些。

### 製作 `nom-check` 的原因

* [npm outdated](https://www.npmjs.org/doc/cli/npm-outdated.html) - 奇怪的輸出，需要執行 `--depth=0` 選項才能進行交互。
* [david](https://github.com/alanshaw/david) - 不支持私有模塊。
* [update-notifier](https://github.com/yeoman/update-notifier) - 只支持單一模塊，而不是 `package.json` 文件中的所有模塊。
* [depcheck](https://github.com/rumpl/depcheck) - 未完待續的不全面工程， `npm-check` 使用了部分 `depcheck` 內容進行開發。

### 關於作者

Hi! 很高興你能夠看到我的這個項目！我叫**Dylan Greene**。在沒有被我的兩個小孩子折騰的時候，我很享受為開源社區貢獻代碼。我也是[Opower](http://opower.com)的一名技術總監。[![@dylang](https://img.shields.io/badge/github-dylang-green.svg)](https://github.com/dylang) [![@dylang](https://img.shields.io/badge/twitter-dylang-blue.svg)](https://twitter.com/dylang)

下面是我的一些其它關於 Node 的項目：

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

_這個列表使用 [anthology](https://github.com/dylang/anthology) 製作。_


### License  使用證書

作者及貢獻者保留一切權利。

通過 [MIT](https://tldrlegal.com/license/mit-license) 協議進行散布。

圖片通過 [CC BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) (Attribution-ShareAlike) 協議進行授權。

***

_使用 [grunt-readme](https://github.com/assemble/grunt-readme) 以及 [grunt-templates-dylang](https://github.com/dylang/grunt-templates-dylang) 寫於 2016 年 4 月 7 日。_

_如果你想改進這份說明，可以看看 `/templates/readme/` 這個目錄。_

***

中文翻譯：[Benjamin](https://twitter.com/itisbenjamin1)  
水平有限，如有能力，更建議看英文原版。  
歡迎糾正任何錯誤。  

