import { platformActions } from './platformActions';
import { rhsmActions } from './rhsmActions';
import { userActions } from './userActions';

const actions = {
  platform: platformActions,
  rhsm: rhsmActions,
  user: userActions
};

const reduxActions = { ...actions };

export { reduxActions as default, reduxActions, platformActions, rhsmActions, userActions };
