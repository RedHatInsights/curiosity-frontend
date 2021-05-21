import { RHSM_API_PATH_ID_TYPES } from '../types/rhsmApiTypes';
import { helpers } from '../common';

const routes = [
  {
    id: 'rhel',
    path: '/rhel',
    pathParameter: [RHSM_API_PATH_ID_TYPES.RHEL],
    productParameter: [RHSM_API_PATH_ID_TYPES.RHEL],
    redirect: null,
    isSearchable: true,
    aliases: ['insights'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewRhel'
  },
  {
    id: 'rhel-arm',
    path: '/rhel-arm',
    pathParameter: [RHSM_API_PATH_ID_TYPES.RHEL_ARM],
    productParameter: [RHSM_API_PATH_ID_TYPES.RHEL],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewRhel'
  },
  {
    id: 'rhel-ibmpower',
    path: '/rhel-ibmpower',
    pathParameter: [RHSM_API_PATH_ID_TYPES.RHEL_IBM_POWER],
    productParameter: [RHSM_API_PATH_ID_TYPES.RHEL],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewRhel'
  },
  {
    id: 'rhel-ibmz',
    path: '/rhel-ibmz',
    pathParameter: [RHSM_API_PATH_ID_TYPES.RHEL_IBM_Z],
    productParameter: [RHSM_API_PATH_ID_TYPES.RHEL],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewRhel'
  },
  {
    id: 'rhel-x86',
    path: '/rhel-x86',
    pathParameter: [RHSM_API_PATH_ID_TYPES.RHEL_X86],
    productParameter: [RHSM_API_PATH_ID_TYPES.RHEL],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewRhel'
  },
  {
    id: 'openshift-container',
    path: '/openshift-container',
    pathParameter: [RHSM_API_PATH_ID_TYPES.OPENSHIFT, RHSM_API_PATH_ID_TYPES.OPENSHIFT_METRICS],
    productParameter: [RHSM_API_PATH_ID_TYPES.OPENSHIFT, RHSM_API_PATH_ID_TYPES.OPENSHIFT_METRICS],
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewOpenShiftContainer'
  },
  {
    id: 'openshift-dedicated',
    path: '/openshift-dedicated',
    pathParameter: [RHSM_API_PATH_ID_TYPES.OPENSHIFT_DEDICATED_METRICS],
    productParameter: [RHSM_API_PATH_ID_TYPES.OPENSHIFT_DEDICATED_METRICS],
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewOpenShiftDedicated'
  },
  {
    id: 'satellite',
    path: '/satellite',
    pathParameter: [RHSM_API_PATH_ID_TYPES.SATELLITE],
    productParameter: [RHSM_API_PATH_ID_TYPES.SATELLITE],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewSatellite'
  },
  {
    id: 'satellite-capsule',
    path: '/satellite-capsule',
    pathParameter: [RHSM_API_PATH_ID_TYPES.SATELLITE_CAPSULE],
    productParameter: [RHSM_API_PATH_ID_TYPES.SATELLITE],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewSatellite'
  },
  {
    id: 'satellite-server',
    path: '/satellite-server',
    pathParameter: [RHSM_API_PATH_ID_TYPES.SATELLITE_SERVER],
    productParameter: [RHSM_API_PATH_ID_TYPES.SATELLITE],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productViewSatellite'
  },
  {
    id: 'optin',
    path: '/optin',
    pathParameter: null,
    productParameter: null,
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: true,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'optinView/optinView'
  },
  {
    id: 'missing',
    path: '/',
    pathParameter: null,
    productParameter: null,
    redirect: '/',
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: true,
    component: 'productView/productViewMissing'
  }
];

export { routes as default, routes };
