import npmCheck from 'npm-check';
import { expect as chaiExpect } from 'chai';
import { execSync } from 'child_process';

describe('ESLint plugins', () => {
  it('should get proper unused deps', async () => {
    const results = await npmCheck({ cwd: __dirname });
    const unusedPackages = results
      .get('packages')
      .filter(_package => _package.unused === true);

    expect(unusedPackages).toHaveLength(1);
    expect(unusedPackages[0].moduleName).toEqual('eslint-plugin-compat');
  });
});
