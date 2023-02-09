import { helpers } from '../common';

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
    id: 'optin',
    path: 'optin',
    redirect: null,
    activateOnError: true,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'optinView/optinView'
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
