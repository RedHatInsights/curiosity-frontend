import { helpers } from '../../common/helpers';
import { routes, navigation } from './routerTypes';

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

/**
 * The app baseName.
 * @type {string}
 */
const baseName =
  (helpers.TEST_MODE && '/') ||
  (helpers.DEV_MODE && '/') ||
  dynamicBaseName({ pathName: window.location.pathname, pathPrefix: helpers.UI_DEPLOY_PATH_PREFIX });

/**
 * The first error route.
 * @type {Object}
 */
const getErrorRoute = routes.find(route => route.activateOnError === true) || {};

/**
 * Return an object matching a specific navigation object.
 * @param id {string}
 * @param pathname {string}
 * @param returnDefault {boolean}
 * @returns {Object}
 */
const getNavigationDetail = ({ id = null, pathname = null, returnDefault = false }) => {
  const defaultItem = returnDefault && navigation.find(item => item.default === true);
  let navigationItem;

  if (id) {
    navigationItem = navigation.find(item => item.id === id);
  }

  if (!navigationItem && pathname) {
    navigationItem = navigation.find(item => item.path === pathname) || (returnDefault && defaultItem);
  }

  if (!navigationItem && returnDefault) {
    navigationItem = defaultItem;
  }

  return { ...(navigationItem || {}) };
};

/**
 * Return an object matching a specific, or the first generic route.
 * @param id {string}
 * @param pathname {string}
 * @returns {Object}
 */
const getRouteDetail = ({ id = null, pathname = null }) => {
  let routeItem;

  if (id) {
    routeItem = routes.find(value => id === value.id);
  }

  if (!routeItem && pathname) {
    routeItem = routes.find(value => pathname === value.to);
    routeItem = routeItem || routes.find(item => pathname.includes(item.to.split(':')[0]));
  }

  return { ...(routeItem || {}) };
};

/**
 * Return an object generated from both generic routes and specific navigation objects.
 * ID is not passed to "getRouteDetail" to avoid conflicts between routing and
 * navigation.
 *
 * @param id {string}
 * @param pathname {string}
 * @param returnDefault {boolean}
 * @returns {Object}
 */
const getNavRouteDetail = ({ id = null, pathname = null, returnDefault = false }) => {
  const navDetail = getNavigationDetail({ id, pathname, returnDefault });
  const routeDetail = getRouteDetail({ pathname: navDetail.path || pathname });

  return { ...routeDetail, ...navDetail };
};

const routerHelpers = {
  baseName,
  dynamicBaseName,
  getErrorRoute,
  getNavigationDetail,
  getRouteDetail,
  getNavRouteDetail
};

export {
  routerHelpers as default,
  routerHelpers,
  baseName,
  dynamicBaseName,
  getErrorRoute,
  getNavigationDetail,
  getRouteDetail,
  getNavRouteDetail
};
