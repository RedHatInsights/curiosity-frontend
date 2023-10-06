import { helpers } from '../common';

/**
 * Routing configuration
 *
 * @memberof Configuration
 * @module Routes
 */

/**
 * Route listing
 *
 * @type {Array<{redirect: null, path: string, default: boolean, component: string, activateOnError: boolean,
 *     disabled: boolean, id: string},{redirect: string, path: string, default: boolean, component: string,
 *     activateOnError: boolean, disabled: boolean, id: string}>}
 */
const routes = [
  {
    id: 'any',
    path: ':productPath',
    redirect: null,
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'productView/productView'
  },
  {
    id: 'missing',
    path: '*',
    redirect: './',
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: true,
    component: 'productView/productViewMissing'
  }
];

export { routes as default, routes };
