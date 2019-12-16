import { helpers } from '../../common/helpers';
import OpenshiftView from '../openshiftView/openshiftView';
import RhelView from '../rhelView/rhelView';
import TourView from '../tourView/tourView';
import { RHSM_API_PATH_ID_TYPES } from '../../types/rhsmApiTypes';

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

  const pathSlice = pathPrefix && new RegExp(path[0]).test(pathPrefix) ? 2 : 1;

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
    to: '/rhel-sw/all',
    redirect: true,
    component: RhelView,
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    title: 'Red Hat Enterprise Linux',
    id: 'rhel-sw',
    to: '/rhel-sw/:variant',
    component: RhelView,
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    title: 'Red Hat OpenShift',
    id: 'openshift-sw',
    to: '/openshift-sw',
    component: OpenshiftView,
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    title: 'Tour',
    id: 'soon',
    to: '/soon',
    component: TourView,
    exact: true,
    render: true,
    activateOnError: true,
    disabled: helpers.UI_DISABLED
  },
  {
    title: 'Tour',
    id: 'tour',
    to: '/tour',
    component: TourView,
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  }
];

const navigation = [
  {
    title: 'Red Hat Enterprise Linux',
    id: 'all',
    path: '/rhel-sw/all',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    default: true
  },
  {
    title: 'ARM',
    id: 'arm',
    path: '/rhel-sw/arm',
    pathParameter: RHSM_API_PATH_ID_TYPES.ARM
  },
  {
    title: 'IBM Power',
    id: 'ibmpower',
    path: '/rhel-sw/ibmpower',
    pathParameter: RHSM_API_PATH_ID_TYPES.IBM_POWER
  },
  {
    title: 'IBM Z systems',
    id: 'ibmz',
    path: '/rhel-sw/ibmz',
    pathParameter: RHSM_API_PATH_ID_TYPES.IBM_Z
  },
  {
    title: 'x86',
    id: 'x86',
    path: '/rhel-sw/x86',
    pathParameter: RHSM_API_PATH_ID_TYPES.X86
  },
  {
    title: 'Red Hat OpenShift',
    id: 'openshift-sw',
    path: '/openshift-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT
  }
];

const getRouteDetail = ({ pathname = null }) => {
  const navigationItem = navigation.find(item => item.path === pathname) || {};
  return (Object.keys(navigationItem || {}).length && navigationItem) || navigation.find(item => item.default === true);
};

export { routes as default, baseName, dynamicBaseName, getRouteDetail, navigation, routes };
