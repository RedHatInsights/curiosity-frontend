import React from 'react';
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
 * Return a base path.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {string} params.appName
 * @returns {string}
 */
const dynamicBasePath = ({ pathName = window.location.pathname, appName: applicationName = helpers.UI_NAME } = {}) =>
  pathName.split(applicationName)[0];

/**
 * App basePath.
 *
 * @type {string}
 */
const basePath = (helpers.TEST_MODE && '/') || (helpers.DEV_MODE && '/') || dynamicBasePath();

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
  config.map(({ activateOnError, component, disabled, id, path: routePath, redirect }) => ({
    activateOnError,
    component,
    disabled,
    exact: true,
    id,
    path: routePath,
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
 * Match route config entries by path.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {Array} params.config
 * @returns {{configs: Array, configFirstMatch: object, configsById: object}}
 */
const getRouteConfigByPath = ({ pathName = dynamicBasePath(), config = routesConfig } = {}) => {
  const basePathDirs = pathName?.split('/').filter(str => str.length > 0);
  const configs = [];
  const allConfigs = [];
  const configsById = {};
  const allConfigsById = {};

  const findConfig = dir => {
    config.forEach(({ id, path: configPath, pathParameter, productParameter, aliases, ...configItem }) => {
      const updatedConfigItem = {
        aliases,
        id,
        path: configPath,
        pathParameter,
        productParameter,
        ...configItem
      };

      if (
        dir &&
        (new RegExp(dir, 'i').test(configPath) ||
          new RegExp(dir, 'i').test(productParameter?.toString()) ||
          new RegExp(dir, 'i').test(pathParameter?.toString()) ||
          new RegExp(dir, 'i').test(aliases?.toString()))
      ) {
        if (!configsById[id]) {
          configsById[id] = { ...updatedConfigItem };
          configs.push({ ...updatedConfigItem });
        }
      }

      if (!allConfigsById[id]) {
        allConfigsById[id] = { ...updatedConfigItem };
        allConfigs.push({ ...updatedConfigItem });
      }
    });
  };

  if (basePathDirs?.length) {
    basePathDirs.forEach(dir => {
      if (dir) {
        const decodedDir = window.decodeURI(dir);
        findConfig(decodedDir);
      }
    });
  } else {
    findConfig();
  }

  return { allConfigs, allConfigsById, configs, configsById, firstMatch: configs?.[0] };
};

/**
 * Return a route config object.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.pathName
 * @param {boolean} params.returnDefault
 * @param {Array} params.config
 * @returns {object}
 */
const getRouteConfig = ({ id = null, pathName, returnDefault = false, config = routesConfig } = {}) => {
  let navRouteItem;

  if (id) {
    navRouteItem = config.find(item => item.id === id);
  }

  if ((!navRouteItem && pathName) || (!navRouteItem && !pathName && !returnDefault)) {
    navRouteItem = getRouteConfigByPath({ pathName, config }).firstMatch;
  }

  if (!navRouteItem && returnDefault) {
    navRouteItem = config.find(item => item.default === true);
  }

  if (navRouteItem) {
    const { search = '', hash = '' } = window.location;
    navRouteItem.routeHref = `${navRouteItem.path}${search}${hash}`;

    const { pathParameter, productParameter } = navRouteItem;
    navRouteItem.pathParameter = (Array.isArray(pathParameter) && pathParameter[0]) || pathParameter;
    navRouteItem.productParameter = (Array.isArray(productParameter) && productParameter[0]) || productParameter;
    navRouteItem.viewParameter =
      (productParameter && `view${(Array.isArray(productParameter) && productParameter[0]) || productParameter}`) ||
      productParameter;
  }

  return { ...(navRouteItem || {}) };
};

/**
 * Import a route component.
 *
 * @param {Node} component
 * @returns {Node}
 */
const importView = component => React.lazy(() => import(/* webpackExclude: /\.test\.js$/ */ `../${component}.js`));

const routerHelpers = {
  appName,
  baseName,
  basePath,
  dynamicBaseName,
  dynamicBasePath,
  generateProductGroups,
  generateRoutes,
  getErrorRoute,
  getRouteConfig,
  getRouteConfigByPath,
  importView,
  platformLandingRedirect,
  platformModalRedirect,
  productGroups,
  routes,
  routesConfig
};

export {
  routerHelpers as default,
  routerHelpers,
  appName,
  baseName,
  basePath,
  dynamicBaseName,
  dynamicBasePath,
  generateProductGroups,
  generateRoutes,
  getErrorRoute,
  getRouteConfig,
  getRouteConfigByPath,
  importView,
  platformLandingRedirect,
  platformModalRedirect,
  productGroups,
  routes,
  routesConfig
};
