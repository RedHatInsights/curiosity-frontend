import React from 'react';
import _memoize from 'lodash/memoize';
import { helpers } from '../../common/helpers';
import { routesConfig, productConfig } from '../../config';

/**
 * Platform name/id.
 *
 * @type {string}
 */
const appName = helpers.UI_NAME;

/**
 * The app baseName. Return an assumed route baseName directory based on existing app name.
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
 * App basePath. Return a base path.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {string} params.appName
 * @returns {string}
 */
const dynamicBasePath = ({ pathName = window.location.pathname, appName: applicationName = helpers.UI_NAME } = {}) =>
  pathName.split(applicationName)[0];

/**
 * The first error route.
 *
 * @type {object}
 */
const errorRoute = routesConfig.find(route => route.activateOnError === true) || {};

/**
 * The first redirect route.
 *
 * @type {object}
 */
const redirectRoute = routesConfig.find(({ disabled, redirect }) => !disabled && redirect);

/**
 * Return array of objects that describes routing.
 *
 * @returns {Array}
 */
const routes = routesConfig;

/**
 * Match route config entries by path.
 *
 * @param {object} params
 * @param {string} params.pathName
 * @param {Array} params.config
 * @returns {{configs: Array, configFirstMatch: object, configsById: object}}
 */
const getRouteConfigByPath = _memoize(({ pathName, configs = productConfig.configs } = {}) => {
  const updatedPathName =
    (/^http/i.test(pathName) && new URL(pathName).pathname) || pathName || window.location.pathname;

  const basePathDirs = updatedPathName
    ?.split('#')?.[0]
    ?.split('?')?.[0]
    ?.split('/')
    .filter(str => str.length > 0)
    ?.reverse();
  const filteredConfigs = [];
  const filteredConfigsById = {};
  const filteredConfigsByGroup = {};
  const allConfigs = configs;

  const findConfig = dir => {
    configs.forEach(configItem => {
      const { productId, productGroup, aliases } = configItem;

      if (
        !(productId in filteredConfigsById) &&
        dir &&
        (new RegExp(dir, 'i').test(aliases?.toString()) ||
          new RegExp(dir, 'i').test(productGroup?.toString()) ||
          new RegExp(dir, 'i').test(productId?.toString()))
      ) {
        filteredConfigsByGroup[productGroup] ??= [];
        filteredConfigsByGroup[productGroup].push(configItem);

        filteredConfigsById[productId] = configItem;
        filteredConfigs.push(configItem);
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

  return {
    allConfigs,
    configs: filteredConfigs,
    configsById: filteredConfigsById,
    configsByGroup: filteredConfigsByGroup,
    firstMatch: filteredConfigs?.[0]
  };
});

/**
 * Import a route component.
 *
 * @param {Node} component
 * @returns {Node}
 */
const importView = component => {
  if (!helpers.TEST_MODE) {
    return React.lazy(() => import(/* webpackExclude: /\.test\.js$/ */ `../${component}.js`));
  }

  return p => <React.Fragment>{JSON.stringify({ ...p, component }, null, 2)}</React.Fragment>;
};

/**
 * Parse search parameters from a string, using a set
 *
 * @param {string} currentPathAndOrSearch
 * @returns {{}}
 */
const parseSearchParams = _memoize((currentPathAndOrSearch = window.location.search) => {
  const { decodeURIComponent, URLSearchParams } = window;
  const parsedSearch = {};

  [
    ...new Set(
      [...new URLSearchParams(decodeURIComponent(currentPathAndOrSearch))].map(([param, value]) => `${param}~${value}`)
    )
  ].forEach(v => {
    const [param, value] = v.split('~');
    parsedSearch[param] = value;
  });

  return parsedSearch;
});

/**
 * Basic path join, minor emulation for path.join.
 *
 * @param {object} paths
 * @returns {string}
 */
const pathJoin = _memoize((...paths) => {
  let updatedPath = Array.from(paths);
  const hasLead = /^\/\//.test(updatedPath[0]);
  updatedPath = updatedPath
    .join('/')
    .replace(/(\/\/)+/g, '~')
    .replace(/~/g, '/')
    .replace(/\/\//g, '/');

  if (hasLead) {
    updatedPath = `/${updatedPath}`;
  }

  return updatedPath;
});

const routerHelpers = {
  appName,
  dynamicBaseName,
  dynamicBasePath,
  redirectRoute,
  errorRoute,
  getRouteConfigByPath,
  importView,
  parseSearchParams,
  pathJoin,
  routes
};

export {
  routerHelpers as default,
  routerHelpers,
  appName,
  dynamicBaseName,
  dynamicBasePath,
  redirectRoute,
  errorRoute,
  getRouteConfigByPath,
  importView,
  parseSearchParams,
  pathJoin,
  routes
};
