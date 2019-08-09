import { helpers } from '../../common/helpers';
import RhelView from '../rhelView/rhelView';

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

  const pathSlice = pathPrefix && new RegExp(path[0]).test(pathPrefix) ? 3 : 2;

  return `/${path.slice(0, pathSlice).join('/')}`;
};

const baseName =
  (helpers.TEST_MODE && '/') ||
  (helpers.DEV_MODE && '/') ||
  dynamicBaseName({ pathName: window.location.pathname, pathPrefix: helpers.UI_DEPLOY_PATH_PREFIX });

/**
 * Return array of objects that describe navigation
 * @return {array}
 */
const routes = [
  {
    title: 'Red Hat Enterprise Linux',
    id: 'rhel',
    to: '/rhel',
    redirect: true,
    component: RhelView,
    exact: true,
    disabled: helpers.UI_DISABLED
  }
];

export { routes as default, baseName, dynamicBaseName, routes };
