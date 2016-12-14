declare module NpmCheck { 
  interface INpmCheckOptions {
    global?: boolean;
    update?: boolean;
    skipUnused?: boolean;
    ignoreDev?: boolean;
    cwd?: string;
    saveExact?: boolean;
    currentState?: Object;
  }

  type INpmCheckGetSetValues = "packages" | "debug" | "global" | "cwd" | "cwdPackageJson" | "emoji";

  type INpmVersionBumpType = "patch" | "minor" | "major" | "prerelease" | "build" | "nonSemver" | null;

  interface INpmCheckCurrentState {
    get: (key: INpmCheckGetSetValues) => INpmCheckPackage[];
    set: (key: INpmCheckGetSetValues, val: any) => void;
  }

  interface INpmCheckPackage {
    moduleName: string;                  // name of the module. 
    homepage: string;                    // url to the home page. 
    regError: any;                       // error communicating with the registry 
    pkgError: any;                       // error reading the package.json 
    latest: string;                      // latest according to the registry. 
    installed: string;                   // version installed 
    isInstalled: boolean;                // Is it installed? 
    notInstalled: boolean;               // Is it installed? 
    packageWanted: string;               // Requested version from the package.json. 
    packageJson: string;                 // Version or range requested in the parent package.json. 
    devDependency: boolean;              // Is this a devDependency? 
    usedInScripts: undefined | string[], // Array of `scripts` in package.json that use this module. 
    mismatch: boolean;                   // Does the version installed not match the range in package.json? 
    semverValid: string;                 // Is the installed version valid semver? 
    easyUpgrade: boolean;                // Will running just `npm install` upgrade the module? 
    bump: INpmVersionBumpType;           // What kind of bump is required to get the latest 
    unused: boolean;                     // Is this module used in the code? 
  }

  //The default function returns a promise
  export default function(options: INpmCheckOptions): {
    then(stateFn: (state: INpmCheckCurrentState) => void): void;
  };
  
}

declare module "npm-check" {
    export = NpmCheck.default;
}