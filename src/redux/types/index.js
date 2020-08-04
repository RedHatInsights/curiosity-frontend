import { appTypes } from './appTypes';
import { graphTypes } from './graphTypes';
import { platformTypes } from './platformTypes';
import { queryTypes } from './queryTypes';
import { rhsmTypes } from './rhsmTypes';
import { userTypes } from './userTypes';

const reduxTypes = {
  app: appTypes,
  graph: graphTypes,
  platform: platformTypes,
  query: queryTypes,
  rhsm: rhsmTypes,
  user: userTypes
};

export { reduxTypes as default, reduxTypes, appTypes, graphTypes, platformTypes, queryTypes, rhsmTypes, userTypes };
