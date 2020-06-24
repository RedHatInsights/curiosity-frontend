import path from 'path';
import { helpers } from '../../common/helpers';
import OpenshiftView from '../openshiftView/openshiftView';
import OptinView from '../optinView/optinView';
import RhelView from '../rhelView/rhelView';
import { RHSM_API_PATH_ID_TYPES } from '../../types/rhsmApiTypes';

/**
 * Platform name/id.
 *
 * @type {string}
 */
const appName = helpers.UI_NAME;

/**
 * Return a string that describes a platform redirect.
 *
 * @returns {Array}
 */
const platformLandingRedirect = path.join(helpers.UI_DEPLOY_PATH_PREFIX, '/');

/**
 * Return a string that describes a platform redirect.
 *
 * @returns {Array}
 */
const platformModalRedirect = path.join(helpers.UI_DEPLOY_PATH_PREFIX, '/?not_entitled=subscriptions');

/**
 * Return array of objects that describes routing.
 *
 * @returns {Array}
 */
const routes = [
  {
    to: '/rhel-sw/all',
    redirect: true,
    component: RhelView,
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    id: 'rhel-sw',
    to: '/rhel-sw/:variant',
    component: RhelView,
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    id: 'openshift-sw',
    to: '/openshift-sw',
    component: OpenshiftView,
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    id: 'optin',
    to: '/optin',
    component: OptinView,
    exact: true,
    render: true,
    activateOnError: true,
    disabled: helpers.UI_DISABLED
  }
];

/**
 * Return an array of objects that describes navigation against API product IDs.
 *
 * @returns {Array}
 */
const navigation = [
  {
    id: 'all',
    path: '/rhel-sw/all',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    default: true
  },
  {
    id: 'arm',
    path: '/rhel-sw/arm',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_ARM
  },
  {
    id: 'ibmpower',
    path: '/rhel-sw/ibmpower',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_IBM_POWER
  },
  {
    id: 'ibmz',
    path: '/rhel-sw/ibmz',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_IBM_Z
  },
  {
    id: 'x86',
    path: '/rhel-sw/x86',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_X86
  },
  {
    id: 'openshift-sw',
    path: '/openshift-sw',
    pathId: 'openshift-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT
  }
];

const routerTypes = {
  appName,
  navigation,
  platformLandingRedirect,
  platformModalRedirect,
  routes
};

export {
  routerTypes as default,
  routerTypes,
  appName,
  navigation,
  platformLandingRedirect,
  platformModalRedirect,
  routes
};
