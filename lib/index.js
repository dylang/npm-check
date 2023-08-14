import npmCheck from './in/index.js';
import createState from './state/state.js';

export default async function init(userOptions) {
    return npmCheck(await createState(userOptions));
}
