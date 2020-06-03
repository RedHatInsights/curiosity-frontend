import { appTypes } from './appTypes';
import { graphTypes } from './graphTypes';
import { platformTypes } from './platformTypes';
import { rhsmTypes } from './rhsmTypes';
import { userTypes } from './userTypes';

const reduxTypes = {
  app: appTypes,
  graph: graphTypes,
  platform: platformTypes,
  rhsm: rhsmTypes,
  user: userTypes
};

export { reduxTypes as default, reduxTypes, appTypes, graphTypes, platformTypes, rhsmTypes, userTypes };
