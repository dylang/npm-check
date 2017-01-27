import npmCheck from 'npm-check';
import { execSync } from 'child_process';

describe('ESLint plugins', () => {
  it('should get proper unused deps', async () => {
    const results = await npmCheck({ cwd: __dirname });
    const unusedPackages = results
      .get('packages')
      .filter(_package => _package.unused === true);

      expect(unusedPackages).toEqual([
        {
          moduleName: 'eslint-plugin-react',
          homepage: 'https://github.com/airbnb/javascript',
          regError: undefined,
          pkgError: undefined,
          latest: '11.0.1',
          installed: '11.0.1',
          isInstalled: true,
          notInstalled: false,
          packageWanted: '11.0.1',
          packageJson: '^11.0.1',
          notInPackageJson: false,
          devDependency: false,
          usedInScripts: undefined,
          mismatch: false,
          semverValid: '11.0.1',
          easyUpgrade: true,
          bump: null,
          unused: true
        }
      ]);
  });
});
