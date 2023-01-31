import { products } from './products';
import { helpers } from '../common';

const routes = [
  ...Object.entries(products.sortedConfigs().byGroupIdConfigs).reduce((acc, [, groupedConfigs]) => {
    const updatedConfig = [
      {
        path: `/${groupedConfigs?.[0]?.productPath}`,
        pathParameter: [...groupedConfigs.map(({ productId }) => productId)],
        productParameter: [...groupedConfigs.map(({ productId }) => productId)],
        productConfig: [...groupedConfigs],
        redirect: null,
        activateOnError: false,
        disabled: helpers.UI_DISABLED,
        default: false,
        component: 'productView/productView'
      }
    ];

    const flatAliases = groupedConfigs.map(({ aliases }) => [...aliases]).flat(1);
    const aliasedConfigs = [...[...new Set(flatAliases)].map(alias => ({ ...updatedConfig[0], path: `/${alias}` }))];

    return [...acc, ...updatedConfig, ...aliasedConfigs];
  }, []),
  {
    id: 'optin',
    path: '/optin',
    redirect: null,
    activateOnError: true,
    disabled: helpers.UI_DISABLED,
    default: false,
    component: 'optinView/optinView'
  },
  {
    id: 'missing',
    path: '/',
    redirect: './',
    activateOnError: false,
    disabled: helpers.UI_DISABLED,
    default: true,
    component: 'productView/productViewMissing'
  }
];

export { routes as default, routes };
