declare module "npm-check" {
  interface INpmCheckOptions {
    global?: boolean;
    update?: boolean;
    skipUnused?: boolean;
    devOnly?: boolean;
    ignoreDev?: boolean;
    cwd?: string;
    saveExact?: boolean;
    currentState?: Object;
  }

  type INpmCheckGetSetValues =
    | "packages"
    | "debug"
    | "global"
    | "cwd"
    | "cwdPackageJson"
    | "emoji";

  type INpmVersionBumpType =
    | "patch"
    | "minor"
    | "major"
    | "prerelease"
    | "build"
    | "nonSemver"
    | null;

  interface INpmCheckCurrentState {
    get: (key: INpmCheckGetSetValues) => INpmCheckPackage[];
    set: (key: INpmCheckGetSetValues, val: any) => void;
  }

  interface INpmCheckPackage {
    /**
     * name of the module.
     */
    moduleName: string;

    /**
     * url to the home page.
     */
    homepage: string;

    /**
     * error communicating with the registry
     */
    regError: any;

    /**
     * error reading the package.json
     */
    pkgError: any;

    /**
     * latest according to the registry.
     */
    latest: string;

    /**
     * version installed
     */
    installed: string;

    /**
     * Is it installed?
     */
    isInstalled: boolean;
    /**
     * Is it installed?
     */
    notInstalled: boolean;

    /**
     * Requested version from the package.json.
     */
    packageWanted: string;

    /**
     * Version or range requested in the parent package.json.
     */
    packageJson: string;

    /**
     * Is this a devDependency?
     */
    devDependency: boolean;

    /**
     * Array of `scripts` in package.json that use this module.
     */
    usedInScripts: undefined | string[];

    /**
     * Does the version installed not match the range in package.json?
     */
    mismatch: boolean;

    /**
     * Is the installed version valid semver?
     */
    semverValid: string;

    /**
     * Will running just `npm install` upgrade the module?
     */
    easyUpgrade: boolean;

    /**
     * What kind of bump is required to get the latest
     */
    bump: INpmVersionBumpType;

    /**
     * Is this module used in the code?
     */
    unused: boolean;
  }

  //The default function returns a promise
  export default function (options: INpmCheckOptions): {
    then(stateFn: (state: INpmCheckCurrentState) => void): void;
  };
}
