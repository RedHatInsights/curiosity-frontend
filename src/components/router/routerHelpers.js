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
 * @param pathname {string}
 * @returns {Object}
 */
const getNavigationDetail = ({ pathname = null }) => {
  let navigationItem;

  if (pathname === 'default') {
    navigationItem = navigation.find(item => item.default === true);
  } else {
    navigationItem = navigation.find(item => item.path === pathname) || {};
  }

  return { ...navigationItem };
};

/**
 * Return an object matching a specific, or the first generic route.
 * @param pathname {string}
 * @returns {Object}
 */
const getRouteDetail = ({ pathname = null }) => {
  let routeItem = pathname && routes.find(value => pathname === value.to);
  routeItem = routeItem || (pathname && routes.find(item => pathname.includes(item.to.split(':')[0]))) || {};
  return { ...routeItem };
};

/**
 * Return an object generated from both generic routes and specific navigation objects.
 * @param pathname {string}
 * @returns {Object}
 */
const getNavRouteDetail = ({ pathname = null }) => {
  const navDetail = getNavigationDetail({ pathname });
  let routeDetail;

  if (navDetail.path) {
    routeDetail = getRouteDetail({ pathname: navDetail.path });
  } else {
    routeDetail = getRouteDetail({ pathname });
  }

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
