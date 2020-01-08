import { appTypes } from './appTypes';
import { rhsmTypes } from './rhsmTypes';
import { userTypes } from './userTypes';

const reduxTypes = {
  app: appTypes,
  rhsm: rhsmTypes,
  user: userTypes
};

export { reduxTypes as default, reduxTypes, appTypes, rhsmTypes, userTypes };
