import { helpers } from '../../common/helpers';
import RhelView from '../rhelView/rhelView';
import { RHSM_API_PATH_RHEL_ID_TYPES } from '../../types/rhelApiTypes';

/**
 * Return an assumed dynamic route baseName directory
 * based on a predictable platform directory depth of
 * /[OPTIONAL]/[environment]/[APP NAME]
 *
 * @param pathName {string}
 * @param pathPrefix {string}
 * @return {string}
 */
const dynamicBaseName = ({ pathName, pathPrefix }) => {
  const path = pathName.split('/');

  path.shift();

  const pathSlice = pathPrefix && new RegExp(path[0]).test(pathPrefix) ? 3 : 2;

  return `/${path.slice(0, pathSlice).join('/')}`;
};

const baseName =
  (helpers.TEST_MODE && '/') ||
  (helpers.DEV_MODE && '/') ||
  dynamicBaseName({ pathName: window.location.pathname, pathPrefix: helpers.UI_DEPLOY_PATH_PREFIX });

/**
 * Return array of objects that describe navigation
 * @return {array}
 */
const routes = [
  {
    title: 'Red Hat Enterprise Linux',
    id: 'rhel',
    to: '/rhel/:variant?',
    redirect: true,
    component: RhelView,
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  }
];

const navigation = [
  {
    title: 'Red Hat Enterprise Linux',
    id: 'all',
    pathParameter: RHSM_API_PATH_RHEL_ID_TYPES.RHEL,
    default: true
  },
  {
    title: 'Compute Node',
    id: 'computenode',
    pathParameter: RHSM_API_PATH_RHEL_ID_TYPES.COMPUTE_NODE
  },
  {
    title: 'Desktop',
    id: 'desktop',
    pathParameter: RHSM_API_PATH_RHEL_ID_TYPES.DESKTOP
  },
  {
    title: 'Server',
    id: 'server',
    pathParameter: RHSM_API_PATH_RHEL_ID_TYPES.SERVER
  },
  {
    title: 'Workstation',
    id: 'workstation',
    pathParameter: RHSM_API_PATH_RHEL_ID_TYPES.WORKSTATION
  },
  {
    title: 'ARM',
    id: 'arm',
    pathParameter: RHSM_API_PATH_RHEL_ID_TYPES.ARM
  },
  {
    title: 'IBM Power',
    id: 'ibmpower',
    pathParameter: RHSM_API_PATH_RHEL_ID_TYPES.IBM_POWER
  },
  {
    title: 'IBM System Z',
    id: 'ibmsystemz',
    pathParameter: RHSM_API_PATH_RHEL_ID_TYPES.IBM_Z
  },
  {
    title: 'x86',
    id: 'x86',
    pathParameter: RHSM_API_PATH_RHEL_ID_TYPES.X86
  }
];

const getRouteDetail = (params = {}) => {
  let navigationItem = {};

  if (params) {
    Object.values(params).forEach(value => {
      navigationItem = navigation.find(item => item.id === value) || navigationItem;
    });
  }

  navigationItem =
    (Object.keys(navigationItem || {}).length && navigationItem) || navigation.find(item => item.default === true);

  return navigationItem;
};

export { routes as default, baseName, dynamicBaseName, getRouteDetail, navigation, routes };
