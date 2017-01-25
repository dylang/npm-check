import npmCheck from './in';
import createState from './state/state';

function init(userOptions) {
  return createState(userOptions).then(currentState => npmCheck(currentState));
}

export default init;
