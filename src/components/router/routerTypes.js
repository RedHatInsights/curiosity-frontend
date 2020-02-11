import path from 'path';
import { helpers } from '../../common/helpers';
import OpenshiftView from '../openshiftView/openshiftView';
import RhelView from '../rhelView/rhelView';
import TourView from '../tourView/tourView';
import { RHSM_API_PATH_ID_TYPES } from '../../types/rhsmApiTypes';

/**
 * Platform name/id.
 */
const appName = helpers.UI_NAME;

/**
 * Return a string that describes a platform redirect.
 * @return {array}
 */
const platformRedirect = path.join(helpers.UI_DEPLOY_PATH_PREFIX, '/?not_entitled=subscriptions');

/**
 * Return array of objects that describes routing.
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

/**
 * Return an array of objects that describes platform navigation.
 * @return {array}
 */
const navigation = [
  {
    title: 'Red Hat Enterprise Linux',
    id: 'all',
    path: '/rhel-sw/all',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL,
    default: true
  },
  {
    title: 'ARM',
    id: 'arm',
    path: '/rhel-sw/arm',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_ARM
  },
  {
    title: 'IBM Power',
    id: 'ibmpower',
    path: '/rhel-sw/ibmpower',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_IBM_POWER
  },
  {
    title: 'IBM Z systems',
    id: 'ibmz',
    path: '/rhel-sw/ibmz',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_IBM_Z
  },
  {
    title: 'x86',
    id: 'x86',
    path: '/rhel-sw/x86',
    pathId: 'rhel-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.RHEL_X86
  },
  {
    title: 'Red Hat OpenShift',
    id: 'openshift-sw',
    path: '/openshift-sw',
    pathId: 'openshift-sw',
    pathParameter: RHSM_API_PATH_ID_TYPES.OPENSHIFT
  }
];

const routerTypes = {
  appName,
  navigation,
  platformRedirect,
  routes
};

export { routerTypes as default, routerTypes, appName, navigation, platformRedirect, routes };
