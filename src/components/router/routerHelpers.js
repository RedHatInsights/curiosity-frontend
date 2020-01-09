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

const baseName =
  (helpers.TEST_MODE && '/') ||
  (helpers.DEV_MODE && '/') ||
  dynamicBaseName({ pathName: window.location.pathname, pathPrefix: helpers.UI_DEPLOY_PATH_PREFIX });

const getErrorRoute = routes.find(route => route.activateOnError === true) || {};

const getRouteDetail = ({ pathname = null }) => {
  const navigationItem = navigation.find(item => item.path === pathname) || {};
  return (Object.keys(navigationItem || {}).length && navigationItem) || navigation.find(item => item.default === true);
};

const routerHelpers = {
  baseName,
  dynamicBaseName,
  getErrorRoute,
  getRouteDetail
};

export { routerHelpers as default, routerHelpers, baseName, dynamicBaseName, getErrorRoute, getRouteDetail };
