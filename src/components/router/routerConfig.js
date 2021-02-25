import React from 'react';
import path from 'path';
import { helpers } from '../../common/helpers';
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
    id: 'rhel-sw',
    to: '/rhel-sw/:variant(all|arm|ibmpower|ibmz|x86)',
    redirect: '/rhel-sw/all',
    component: React.lazy(() => import('../productView/productViewRhel')),
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    id: 'openshift-sw',
    to: '/openshift-sw',
    component: React.lazy(() => import('../openshiftView/openshiftView')),
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    id: 'openshift-dedicated-sw',
    to: '/openshift-sw/dedicated',
    component: React.lazy(() => import('../productView/productViewOpenShiftDedicated')),
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    id: 'satellite-sw',
    to: '/satellite-sw/:variant(all|satellite-capsule|satellite-server)',
    component: React.lazy(() => import('../productView/productViewSatellite')),
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    id: 'optin',
    to: '/optin',
    component: React.lazy(() => import('../optinView/optinView')),
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
    productParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.RHEL}`,
    default: true
  },
  {
    id: 'arm',
    path: '/rhel-sw/arm',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_ARM,
    productParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.RHEL}`
  },
  {
    id: 'ibmpower',
    path: '/rhel-sw/ibmpower',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_IBM_POWER,
    productParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.RHEL}`
  },
  {
    id: 'ibmz',
    path: '/rhel-sw/ibmz',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_IBM_Z,
    productParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.RHEL}`
  },
  {
    id: 'x86',
    path: '/rhel-sw/x86',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_X86,
    productParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.RHEL}`
  },
  {
    id: 'openshift-sw',
    path: '/openshift-sw',
    pathId: 'openshift-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT,
    productParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.OPENSHIFT}`
  },
  {
    id: 'openshift-dedicated-sw',
    path: '/openshift-sw/dedicated',
    pathId: 'openshift-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT_DEDICATED_METRICS,
    productParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT_DEDICATED_METRICS,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.OPENSHIFT_DEDICATED_METRICS}`
  },
  {
    id: 'satellite-sw',
    path: '/satellite-sw/all',
    pathId: 'satellite-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.SATELLITE,
    productParameter: RHSM_API_PATH_ID_TYPES.SATELLITE,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.SATELLITE}`
  },
  {
    id: 'satellite-capsule',
    path: '/satellite-sw/satellite-capsule',
    pathId: 'satellite-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.SATELLITE_CAPSULE,
    productParameter: RHSM_API_PATH_ID_TYPES.SATELLITE,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.SATELLITE}`
  },
  {
    id: 'satellite-server',
    path: '/satellite-sw/satellite-server',
    pathId: 'satellite-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.SATELLITE_SERVER,
    productParameter: RHSM_API_PATH_ID_TYPES.SATELLITE,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.SATELLITE}`
  }
];

const routerConfig = {
  appName,
  navigation,
  platformLandingRedirect,
  platformModalRedirect,
  routes
};

export {
  routerConfig as default,
  routerConfig,
  appName,
  navigation,
  platformLandingRedirect,
  platformModalRedirect,
  routes
};
