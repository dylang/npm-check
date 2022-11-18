import test from 'ava';
import npmCheck from './lib/index.js';

test('should be possible to import and run the library against the current directory', async t => {
    const currentState = await npmCheck({});
    const packages = await currentState.get('packages');
    t.truthy(packages.length > 0);
});
