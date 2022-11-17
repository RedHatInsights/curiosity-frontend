import { config as rhelConfig } from './product.rhel';
import { config as openshiftContainerConfig } from './product.openshiftContainer';
import { config as openshiftMetricsConfig } from './product.openshiftMetrics';
import { config as openshiftDedicatedConfig } from './product.openshiftDedicated';
import { config as rhacsConfig } from './product.rhacs';
import { config as rhodsConfig } from './product.rhods';
import { config as rhosakConfig } from './product.rhosak';
import { config as satelliteProductConfig } from './product.satellite';
import { RHSM_API_PATH_PRODUCT_TYPES } from '../services/rhsm/rhsmConstants';
import { helpers } from '../common';

const routes = [
  {
    id: 'rhel',
    path: '/rhel',
    pathParameter: [RHSM_API_PATH_PRODUCT_TYPES.RHEL],
    productParameter: [rhelConfig.productGroup],
    productConfig: [{ ...rhelConfig, productId: RHSM_API_PATH_PRODUCT_TYPES.RHEL }],
    redirect: null,
    isSearchable: true,
    aliases: ['insights'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'rhel-arm',
    path: '/rhel-arm',
    pathParameter: [RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM],
    productParameter: [rhelConfig.productGroup],
    productConfig: [{ ...rhelConfig, productId: RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM }],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'rhel-ibmpower',
    path: '/rhel-ibmpower',
    pathParameter: [RHSM_API_PATH_PRODUCT_TYPES.RHEL_IBM_POWER],
    productParameter: [rhelConfig.productGroup],
    productConfig: [{ ...rhelConfig, productId: RHSM_API_PATH_PRODUCT_TYPES.RHEL_IBM_POWER }],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'rhel-ibmz',
    path: '/rhel-ibmz',
    pathParameter: [RHSM_API_PATH_PRODUCT_TYPES.RHEL_IBM_Z],
    productParameter: [rhelConfig.productGroup],
    productConfig: [{ ...rhelConfig, productId: RHSM_API_PATH_PRODUCT_TYPES.RHEL_IBM_Z }],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'rhel-x86',
    path: '/rhel-x86',
    pathParameter: [RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86],
    productParameter: [rhelConfig.productGroup],
    productConfig: [{ ...rhelConfig, productId: RHSM_API_PATH_PRODUCT_TYPES.RHEL_X86 }],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'openshift-container',
    path: '/openshift-container',
    pathParameter: [openshiftContainerConfig.productId, openshiftMetricsConfig.productId],
    productParameter: [openshiftContainerConfig.productGroup, openshiftMetricsConfig.productGroup],
    productConfig: [openshiftContainerConfig, openshiftMetricsConfig],
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'openshift-dedicated',
    path: '/openshift-dedicated',
    pathParameter: [openshiftDedicatedConfig.productId],
    productParameter: [openshiftDedicatedConfig.productGroup],
    productConfig: [openshiftDedicatedConfig],
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'rhacs',
    path: '/rhacs',
    pathParameter: [rhacsConfig.productId],
    productParameter: [rhacsConfig.productGroup],
    productConfig: [rhacsConfig],
    redirect: null,
    isSearchable: true,
    aliases: ['rhacs'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'rhods',
    path: '/rhods',
    pathParameter: [rhodsConfig.productId],
    productParameter: [rhodsConfig.productGroup],
    productConfig: [rhodsConfig],
    redirect: null,
    isSearchable: true,
    aliases: ['rhods'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'rhosak',
    path: '/streams',
    pathParameter: [rhosakConfig.productId],
    productParameter: [rhosakConfig.productGroup],
    productConfig: [rhosakConfig],
    redirect: null,
    isSearchable: true,
    aliases: ['application-services', 'streams', 'rhosak'],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'satellite',
    path: '/satellite',
    pathParameter: [RHSM_API_PATH_PRODUCT_TYPES.SATELLITE],
    productParameter: [satelliteProductConfig.productGroup],
    productConfig: [{ ...satelliteProductConfig, productId: RHSM_API_PATH_PRODUCT_TYPES.SATELLITE }],
    redirect: null,
    isSearchable: true,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'satellite-capsule',
    path: '/satellite-capsule',
    pathParameter: [RHSM_API_PATH_PRODUCT_TYPES.SATELLITE_CAPSULE],
    productParameter: [satelliteProductConfig.productGroup],
    productConfig: [{ ...satelliteProductConfig, productId: RHSM_API_PATH_PRODUCT_TYPES.SATELLITE_CAPSULE }],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'satellite-server',
    path: '/satellite-server',
    pathParameter: [RHSM_API_PATH_PRODUCT_TYPES.SATELLITE_SERVER],
    productParameter: [satelliteProductConfig.productGroup],
    productConfig: [{ ...satelliteProductConfig, productId: RHSM_API_PATH_PRODUCT_TYPES.SATELLITE_SERVER }],
    redirect: null,
    isSearchable: false,
    aliases: [],
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'optin',
    path: '/optin',
    pathParameter: null,
    productParameter: null,
    productConfig: null,
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
    productConfig: null,
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
