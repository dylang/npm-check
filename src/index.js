import npmCheck from './in';
import createState from './state/state';

export default function init(userOptions) {
  return createState(userOptions).then(currentState => npmCheck(currentState));
}
