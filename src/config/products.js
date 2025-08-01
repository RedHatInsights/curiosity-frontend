import { helpers } from '../common/helpers';

/**
 * Pre-parsed product configurations
 *
 * @memberof Configuration
 * @module Products
 * @property {module} Ansible
 * @property {module} OpenShiftContainer
 * @property {module} OpenShiftDedicated
 * @property {module} OpenShiftMetrics
 * @property {module} RHACM
 * @property {module} RHACS
 * @property {module} RHEL
 * @property {module} RHEL-X86-ELS-PAYG
 * @property {module} RHODS
 * @property {module} ROSA
 * @property {module} Satellite
 */

/**
 * IIFE for generating a product configs listing via webpack.
 * - Uses webpack compiler to group all configuration files within the directory.
 *
 * @type {Array}
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
        ...require('fs') // eslint-disable-line no-unsafe-optional-chaining, n/global-require
          ?.readdirSync('./src/config')
          ?.filter(file => /product\.[a-z]+\.js/i.test(file))
          ?.map(file => require(`./${file}`)) // eslint-disable-line n/global-require, import/no-dynamic-require
      ];
    }

    console.warn(`Product configuration failed to load: ${e.message}`);
    return [];
  }
})()?.map(value => value.config);

/**
 * Sorted/organized/grouped product configs.
 *
 * - byAlias,object configurations associated with product aliases
 * - byAnything, object of all productGroups, productIds, productPaths, and aliases with lists of their related
 *     configurations
 * - byAnythingPathIds, list of identifiers associated with all productGroups, productIds, productPaths, and aliases
 * - byAnythingVariants, object of all productGroups, productIds, productPaths, and aliases associated with lists
 *     of their related variants
 * - byGroupIdConfigs, object of productGroup properties against an array of associated product configs
 * - byGroupIds, object of productGroup properties against an array of associated productId strings.
 * - byGroupIdVariants, object of productGroup properties against an array of associated product variants
 * - byProductIdConfigs, object of productId properties against a product config
 * - byProductIds, a unique array of all productId strings
 * - byProductPathConfigs, object of productPath properties against an array of associated product configs
 * - byViewIdConfigs, object of viewId properties against an array of associated product configs
 * - byViewIds, object of viewId properties against an array of associated productId strings. "viewId" was
 *     created because of the overlap with productIds and productGroups, this may be refactored in the future
 *
 * @param {productConfigs} configs
 * @returns {{byGroupIdVariants: {}, byProductPathConfigs: {}, byAnythingVariants: {}, byAnything: {},
 *     byAnythingPathIds: string[], byGroupIdConfigs: {}, byViewIds: {}, byProductIds: any[], byAlias: {},
 *     byGroupIds: {}, byViewIdConfigs: {}, byProductIdConfigs: {}}}
 */
const sortedProductConfigs = helpers.memo((configs = productConfigs) => {
  const viewIdConfigs = {};
  const productAliases = {};
  const productIds = new Set();
  const productIdConfigs = {};
  const productPathConfigs = {};
  const anything = {};
  const anythingVariants = {};
  const groupIdConfigs = {};
  const groupedGroupIds = {};
  const groupedVariants = {};
  const groupedViewIds = {};

  configs?.forEach(config => {
    const { aliases, productGroup, productId, productLabel, productPath, productVariants, viewId } = config;

    if (productGroup && productId) {
      anything[productGroup] ??= {};
      anything[productGroup][productId] = config;
    }

    if (productId) {
      anything[productId] ??= {};
      anything[productId][productId] = config;
    }

    if (productLabel && productId) {
      anything[productLabel] ??= {};
      anything[productLabel][productId] = config;
    }

    if (productPath && productId) {
      anything[productPath] ??= {};
      anything[productPath][productId] = config;
    }

    aliases?.forEach(alias => {
      if (productId) {
        anything[alias] ??= {};
        anything[alias][productId] = config;
      }

      productAliases[alias] ??= [];
      productAliases[alias].push(config);
    });

    productVariants?.forEach(variant => {
      if (productId) {
        anything[variant] ??= {};
        anything[variant][productId] = config;
        anything[variant][productId] = { ...config, productId: variant };
      }

      productAliases[variant] ??= [];
      productAliases[variant].push({ ...config, productId: variant });
    });

    if (productId) {
      productIdConfigs[productId] = config;
      productIds.add(productId);
    }

    if (productPath) {
      productPathConfigs[productPath] ??= [];
      productPathConfigs[productPath].push(config);
    }

    if (productGroup) {
      groupIdConfigs[productGroup] ??= [];
      groupIdConfigs[productGroup].push(config);

      if (Array.isArray(productVariants)) {
        groupedVariants[productGroup] ??= [];
        groupedVariants[productGroup].push(...productVariants);
      }
    }

    if (productGroup && productId) {
      groupedGroupIds[productGroup] ??= [];
      groupedGroupIds[productGroup].push(productId);

      if (!groupedVariants[productGroup]?.includes(productId)) {
        groupedVariants[productGroup] ??= [];
        groupedVariants[productGroup].push(productId);
      }
    }

    if (viewId) {
      viewIdConfigs[viewId] ??= [];
      viewIdConfigs[viewId].push(config);
    }

    if (viewId && productId) {
      groupedViewIds[viewId] ??= [];
      groupedViewIds[viewId].push(productId);
    }
  });

  Object.entries(anything).forEach(([key, value]) => {
    anything[key] = Object.values(value);
    anythingVariants[key] ??= [];

    anything[key].forEach(({ productGroup }) => {
      if (productGroup) {
        anythingVariants[key] = Array.from(
          new Set([...anythingVariants[key], ...groupedVariants[productGroup]])
        ).sort();
      }
    });
  });

  return helpers.objFreeze({
    byAlias: productAliases,
    byAnything: anything,
    byAnythingPathIds: Object.keys(anything).sort(),
    byAnythingVariants: anythingVariants,
    byGroupIdConfigs: groupIdConfigs,
    byGroupIds: groupedGroupIds,
    byGroupIdVariants: groupedVariants,
    byProductPathConfigs: productPathConfigs,
    byProductIdConfigs: productIdConfigs,
    byProductIds: Array.from(productIds),
    byViewIdConfigs: viewIdConfigs,
    byViewIds: groupedViewIds
  });
});

const products = {
  configs: productConfigs,
  sortedConfigs: sortedProductConfigs
};

export { products as default, products, productConfigs, sortedProductConfigs };
