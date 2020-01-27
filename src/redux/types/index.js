import { appTypes } from './appTypes';
import { platformTypes } from './platformTypes';
import { rhsmTypes } from './rhsmTypes';
import { userTypes } from './userTypes';

const reduxTypes = {
  app: appTypes,
  platform: platformTypes,
  rhsm: rhsmTypes,
  user: userTypes
};

export { reduxTypes as default, reduxTypes, appTypes, platformTypes, rhsmTypes, userTypes };
