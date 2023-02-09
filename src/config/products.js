import _memoize from 'lodash/memoize';

/**
 * IIFE for generating a product configs listing via webpack
 *
 * @type {{aliases: string[], productGroup: string, productId: string, productLabel: string, productDisplay: string, viewId: string,
 *     productArchitectures: string[], productVariants: string[], query: object, graphTallyQuery: object, inventoryHostQuery: object,
 *     inventorySubscriptionsQuery: object, initialGraphFilters: {}[], initialGraphSettings: object, initialGuestsFilters: {}[],
 *     initialInventoryFilters: {}[], initialSubscriptionsInventoryFilters: {}[], initialToolbarFilters: {}[], }[]}
 */
const productConfigs = (() => {
  try {
    const path = require.context('./', false, /product\.[\d\D]+\.js$/i);
    return path.keys().map(path);
  } catch (e) {
    /**
     * Basic configuration for testing only.
     */
    if (process.env.REACT_APP_ENV === 'test' && require) {
      return [
        ...require('fs') // eslint-disable-line
          ?.readdirSync('./src/config') // eslint-disable-line
          ?.filter(file => /product\.[a-z]+\.js/i.test(file)) // eslint-disable-line
          ?.map(file => require(`./${file}`)) // eslint-disable-line
      ];
    }

    console.warn(`Product configuration failed to load: ${e.message}`);
    return [];
  }
})()?.map(value => value.config);

/**
 * Sorted/organized/grouped product configs.
 * - byGroupIdConfigs, object of productGroup properties against an array of associated product configs
 * - byViewIds, object of viewId properties against an array of associated productId strings. "viewId" was created because of the
 *     overlap with productIds and productGroups, this may be refactored in the future
 * - byProductIds, a unique array of all productId strings
 * - byGroupIds, object of productGroup properties against an array of associated productId strings.
 * - byViewIdConfigs, object of viewId properties against an array of associated product configs
 * - byProductIdConfigs, object of productId properties against a product config
 *
 * @param {productConfigs} configs
 * @returns {{byGroupIdConfigs: {}, byViewIds: {}, byProductIds: any[], byGroupIds: {}, byViewIdConfigs: {}, byProductIdConfigs: {}}}
 */
const sortedProductConfigs = _memoize((configs = productConfigs) => {
  const productIds = new Set();
  const productIdConfigs = {};
  const groupIdConfigs = {};
  const groupedGroupIds = {};
  const viewIdConfigs = {};
  const groupedViewIds = {};

  configs?.forEach(config => {
    Object.freeze(config);

    const { productGroup, productId, viewId } = config;
    productIdConfigs[productId] = config;
    productIds.add(productId);

    groupIdConfigs[productGroup] ??= [];
    groupIdConfigs[productGroup].push(config);

    groupedGroupIds[productGroup] ??= [];
    groupedGroupIds[productGroup].push(productId);

    viewIdConfigs[viewId] ??= [];
    viewIdConfigs[viewId].push(config);

    groupedViewIds[viewId] ??= [];
    groupedViewIds[viewId].push(productId);
  });

  return {
    byGroupIdConfigs: groupIdConfigs,
    byGroupIds: groupedGroupIds,
    byProductIdConfigs: productIdConfigs,
    byProductIds: Array.from(productIds),
    byViewIdConfigs: viewIdConfigs,
    byViewIds: groupedViewIds
  };
});

const products = {
  configs: productConfigs,
  sortedConfigs: sortedProductConfigs
};

export { products as default, products, productConfigs, sortedProductConfigs };
