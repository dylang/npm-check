import npmCheck from './in/index.js';
import createState from './state/state.js';

async function init(userOptions) {
    return npmCheck(await createState(userOptions));
}

export default init;
