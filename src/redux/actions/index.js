import { rhsmActions } from './rhsmActions';
import { userActions } from './userActions';

const actions = {
  rhsm: rhsmActions,
  user: userActions
};

const reduxActions = { ...actions };

export { reduxActions as default, reduxActions, rhsmActions, userActions };
