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
    to: '/:variant(rhel|rhel-arm|rhel-ibmpower|rhel-ibmz|rhel-x86)',
    component: React.lazy(() => import('../productView/productViewRhel')),
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    to: '/openshift-container',
    component: React.lazy(() => import('../openshiftView/openshiftView')),
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    to: '/openshift-dedicated',
    component: React.lazy(() => import('../productView/productViewOpenShiftDedicated')),
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
    to: '/:variant(satellite|satellite-capsule|satellite-server)',
    component: React.lazy(() => import('../productView/productViewSatellite')),
    exact: true,
    render: true,
    disabled: helpers.UI_DISABLED
  },
  {
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
    id: 'rhel',
    path: '/rhel',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    productParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.RHEL}`,
    default: true
  },
  {
    id: 'rhel-arm',
    path: '/rhel-arm',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_ARM,
    productParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.RHEL}`
  },
  {
    id: 'rhel-ibmpower',
    path: '/rhel-ibmpower',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_IBM_POWER,
    productParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.RHEL}`
  },
  {
    id: 'rhel-ibmz',
    path: '/rhel-ibmz',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_IBM_Z,
    productParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.RHEL}`
  },
  {
    id: 'rhel-x86',
    path: '/rhel-x86',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_X86,
    productParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.RHEL}`
  },
  {
    id: 'openshift-container',
    path: '/openshift-container',
    pathParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT,
    productParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.OPENSHIFT}`
  },
  {
    id: 'openshift-dedicated',
    path: '/openshift-dedicated',
    pathParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT_DEDICATED_METRICS,
    productParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT_DEDICATED_METRICS,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.OPENSHIFT_DEDICATED_METRICS}`
  },
  {
    id: 'satellite',
    path: '/satellite',
    pathParameter: RHSM_API_PATH_ID_TYPES.SATELLITE,
    productParameter: RHSM_API_PATH_ID_TYPES.SATELLITE,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.SATELLITE}`
  },
  {
    id: 'satellite-capsule',
    path: '/satellite-capsule',
    pathParameter: RHSM_API_PATH_ID_TYPES.SATELLITE_CAPSULE,
    productParameter: RHSM_API_PATH_ID_TYPES.SATELLITE,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.SATELLITE}`
  },
  {
    id: 'satellite-server',
    path: '/satellite-server',
    pathParameter: RHSM_API_PATH_ID_TYPES.SATELLITE_SERVER,
    productParameter: RHSM_API_PATH_ID_TYPES.SATELLITE,
    viewParameter: `view${RHSM_API_PATH_ID_TYPES.SATELLITE}`
  },
  {
    id: 'optin',
    path: '/optin',
    pathParameter: null,
    productParameter: null,
    viewParameter: null
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
