import npmCheck from 'npm-check';
import { execSync } from 'child_process';

describe('ESLint config', () => {
  it('should get proper unused deps', async () => {
    const results = await npmCheck({ cwd: __dirname});
    const unusedPackages = results
      .get('packages')
      .filter(_package => _package.unused === true);

    expect(unusedPackages).toEqual([]);
  });
});
