import path from 'path';
import { helpers } from '../../common/helpers';
import { routesConfig } from '../../config';

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
 * Return an assumed route baseName directory based on existing app name.
 * App name is defined in dotenv and package.json/insights.appname
 * [environment]/[OPTIONAL]/[OPTIONAL]/[APP NAME]
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {string} params.appName
 * @returns {string}
 */
const dynamicBaseName = ({ pathName = window.location.pathname, appName: applicationName = helpers.UI_NAME } = {}) =>
  `${pathName.split(applicationName)[0]}${applicationName}`;

/**
 * The app baseName.
 *
 * @type {string}
 */
const baseName = (helpers.TEST_MODE && '/') || (helpers.DEV_MODE && '/') || dynamicBaseName();

/**
 * App basePath.
 *
 * @type {string}
 */
const basePath =
  (helpers.TEST_MODE && '/') || (helpers.DEV_MODE && '/') || window.location.pathname.split(helpers.UI_NAME)[0];

/**
 * ToDo: now that navigation is generated we can bypass and use route configuration directly
 * Review removing "navigation" and using the route config directly.
 */
/**
 * Generate navigation list, used to help in look ups for "missing products" and provide additional route details.
 *
 * @param {Array} config
 * @returns {{path: string, default: boolean, component: Node, productParameter: string,
 *     viewParameter: string, activateOnError: boolean, id: string, isSearchable: boolean, pathParameter: string}[]}
 */
const generateNavigation = (config = routesConfig) =>
  config.map(({ pathParameter, productParameter, ...params }) => ({
    pathParameter: (Array.isArray(pathParameter) && pathParameter[0]) || pathParameter,
    productParameter: (Array.isArray(productParameter) && productParameter[0]) || productParameter,
    viewParameter:
      (productParameter && `view${(Array.isArray(productParameter) && productParameter[0]) || productParameter}`) ||
      productParameter,
    ...params
  }));

/**
 * Return an array of objects that describes navigation against API product IDs.
 *
 * @returns {Array}
 */
const navigation = generateNavigation();

/**
 * Generate product groups for applying query filter resets.
 *
 * @param {Array} config
 * @returns {Array}
 */
const generateProductGroups = (config = routesConfig) => {
  const productGroups = {};

  config.forEach(({ pathParameter, productParameter }) => {
    const viewIds = ((Array.isArray(productParameter) && productParameter) || [productParameter]).map(
      id => (id && `view${id}`) || id
    );

    viewIds.forEach((id, index) => {
      if (id) {
        if (!productGroups[id]) {
          productGroups[id] = [];
        }

        if (pathParameter) {
          productGroups[id].push((Array.isArray(pathParameter) && pathParameter?.[index]) || pathParameter);
        }
      }
    });
  });

  return productGroups;
};

/**
 * Reference for products grouped by view.
 */
const productGroups = generateProductGroups();

/**
 * Generate routes to be consumed by router.
 *
 * @param {Array} config
 * @returns {Array}
 */
const generateRoutes = (config = routesConfig) =>
  config.map(({ activateOnError, component, disabled, path: routePath, redirect }) => ({
    to: routePath,
    activateOnError,
    component,
    disabled,
    exact: true,
    render: true,
    redirect
  }));

/**
 * Return array of objects that describes routing.
 *
 * @returns {Array}
 */
const routes = generateRoutes();

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
 * @param {Array} params.navigation
 * @returns {object}
 */
const getNavigationDetail = ({ id = null, pathname = null, returnDefault = false, navigation: nav = navigation }) => {
  const defaultItem = returnDefault && nav.find(item => item.default === true);
  let navigationItem;

  if (id) {
    navigationItem = nav.find(item => item.id === id);
  }

  if (!navigationItem && pathname) {
    navigationItem =
      nav.find(item => item.path.replace(/\/$/, '') === pathname.replace(/\/$/, '')) || (returnDefault && defaultItem);
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
 * @param {Array} params.routes
 * @returns {object}
 */
const getRouteDetail = ({ id = null, pathname = null, routes: rt = routes }) => {
  let routeItem;

  if (id) {
    routeItem = rt.find(value => id === value.id);
  }

  if (!routeItem && pathname) {
    routeItem = rt.find(value => pathname === value.to);
    routeItem = routeItem || rt.find(item => item?.to?.includes(pathname.split('/').reverse()[0]));
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
  appName,
  baseName,
  basePath,
  dynamicBaseName,
  generateNavigation,
  generateProductGroups,
  generateRoutes,
  getErrorRoute,
  getNavigationDetail,
  getRouteDetail,
  getNavRouteDetail,
  navigation,
  platformLandingRedirect,
  platformModalRedirect,
  productGroups,
  routes
};

export {
  routerHelpers as default,
  routerHelpers,
  appName,
  baseName,
  basePath,
  dynamicBaseName,
  generateNavigation,
  generateProductGroups,
  generateRoutes,
  getErrorRoute,
  getNavigationDetail,
  getRouteDetail,
  getNavRouteDetail,
  navigation,
  platformLandingRedirect,
  platformModalRedirect,
  productGroups,
  routes
};
