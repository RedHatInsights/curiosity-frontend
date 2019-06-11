import * as rhelActions from './rhelActions';
import * as userActions from './userActions';

const actions = {
  rhel: rhelActions,
  user: userActions
};

const reduxActions = { ...actions };

export { reduxActions as default, reduxActions, rhelActions, userActions };
