// flow-typed signature: 5d60d0e2e1a024fad66e58cd775cdcfc
// flow-typed version: e6f7626e10/meow_v3.x.x/flow_>=v0.28.x

declare module 'meow' {
  declare type options = string | Array<string> | {
    description?: string,
    help: string,
    version?: string | boolean,
    pkg?: string | Object,
    argv?: Array<string>,
    inferType?: boolean
  };

  declare type minimistOptions = {
    string?: string | Array<string>,
    boolean?: boolean | string | Array<string>,
    alias?: { [arg: string]: string | Array<string> },
    default?: { [arg: string]: any },
    stopEarly?: boolean,
    // TODO: Strings as keys don't work...
    // '--'? boolean,
    unknown?: (param: string) => boolean
  };

  declare module.exports: (
    options: options,
    minimistOptions?: minimistOptions,
  ) => {
    input: Array<string>,
    flags: { [flag: string]: string | boolean },
    pkg: Object,
    help: string,
    showHelp: Function
  }
}
