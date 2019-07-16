import { helpers } from '../../common/helpers';
import RhelView from '../rhelView/rhelView';

/**
 * Return the application base directory.
 * @type {string}
 */
const baseName = helpers.UI_PATH;

/**
 * Return array of objects that describe navigation
 * @return {array}
 */
const routes = [
  {
    title: 'Red Hat Enterprise Linux',
    id: 'rhel',
    to: '/redhatenterpriselinux',
    redirect: true,
    component: RhelView
  }
];

export { routes as default, baseName, routes };
