import { helpers } from '../../common/helpers';
import { routes, navigation } from './routerConfig';

/**
 * Return an assumed route baseName directory based on existing app name.
 * App name is defined in dotenv and package.json/insights.appname
 * [environment]/[OPTIONAL]/[OPTIONAL]/[APP NAME]
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {string} params.appName
 * @returns {string}
 */
const dynamicBaseName = ({ pathName = window.location.pathname, appName = helpers.UI_NAME } = {}) =>
  `${pathName.split(appName)[0]}${appName}`;

/**
 * The app baseName.
 *
 * @type {string}
 */
const baseName = (helpers.TEST_MODE && '/') || (helpers.DEV_MODE && '/') || dynamicBaseName();

/**
 * The first error route.
 *
 * @type {object}
 */
const getErrorRoute = routes.find(route => route.activateOnError === true) || {};

/**
 * Return an object matching a specific navigation object.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.pathname
 * @param {boolean} params.returnDefault
 * @returns {object}
 */
const getNavigationDetail = ({ id = null, pathname = null, returnDefault = false }) => {
  const defaultItem = returnDefault && navigation.find(item => item.default === true);
  let navigationItem;

  if (id) {
    navigationItem = navigation.find(item => item.id === id);
  }

  if (!navigationItem && pathname) {
    navigationItem =
      navigation.find(item => item.path.replace(/\/$/, '') === pathname.replace(/\/$/, '')) ||
      (returnDefault && defaultItem);
  }

  if (!navigationItem && returnDefault) {
    navigationItem = defaultItem;
  }

  /**
   * Note: have to account for carrying through location.search and location.hash, future updates
   * Originally, we used a split on window.location.href.split(navigationItem.path) as an easy way
   * to pull everything and maintain sequence, but there appears to be a race like condition
   * happening on certain routes where window.location.href is updated first in some routing
   * instances, and then in other instances requires being updated by the app/GUI.
   */
  if (navigationItem) {
    const { search = '', hash = '' } = window.location;

    navigationItem.routeHref = `${navigationItem.path}${search}${hash}`;
  }

  return { ...(navigationItem || {}) };
};

/**
 * Return an object matching a specific, or the first generic route.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.pathname
 * @returns {object}
 */
const getRouteDetail = ({ id = null, pathname = null }) => {
  let routeItem;

  if (id) {
    routeItem = routes.find(value => id === value.id);
  }

  if (!routeItem && pathname) {
    routeItem = routes.find(value => pathname === value.to);
    routeItem = routeItem || routes.find(item => item?.to?.includes(pathname.split('/').reverse()[0]));
  }

  return { ...(routeItem || {}) };
};

/**
 * Return an object generated from both generic routes and specific navigation objects.
 * ID is not passed to "getRouteDetail" to avoid conflicts between routing and
 * navigation.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.pathname
 * @param {boolean} params.returnDefault
 * @returns {object}
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
