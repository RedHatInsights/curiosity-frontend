import React, { useCallback, useContext } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import { reduxHelpers } from '../../redux/common';
import { storeHooks } from '../../redux/hooks';
import { rhsmConstants, RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common/helpers';

/**
 * @memberof ProductView
 * @module ProductViewContext
 */

/**
 * Route context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{}, helpers.noop];

const ProductViewContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated product view context.
 *
 * @returns {React.Context<{}>}
 */
const useProductViewContext = () => useContext(ProductViewContext);

/**
 * Return a query object from initial product config and Redux store.
 *
 * @param {string} queryType An identifier used to pull from both config and Redux, they should named the same.
 * @param {object} options
 * @param {string} options.overrideId A custom identifier, used for scenarios like the Guest inventory IDs
 * @param {object} options.useProductViewContext
 * @param {Function} options.useSelectors
 * @returns {object}
 */
const useProductQueryFactory = (
  queryType,
  {
    overrideId,
    useProductViewContext: useAliasProductViewContext = useProductViewContext,
    useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
  } = {}
) => {
  const { [queryType]: initialQuery, productId, viewId } = useAliasProductViewContext();
  const [queryOverride, queryProduct, queryView] = useAliasSelectors([
    ({ view }) => view?.[queryType]?.[overrideId],
    ({ view }) => view?.[queryType]?.[productId],
    ({ view }) => view?.[queryType]?.[viewId]
  ]);

  return {
    ...initialQuery,
    ...queryOverride,
    ...queryProduct,
    ...queryView
  };
};

/**
 * Return a base product query
 *
 * @param {object} options
 * @param {string} options.queryType
 * @param {Function} options.useProductQueryFactory
 * @param {object} options.options
 * @returns {object}
 */
const useProductQuery = ({
  queryType = 'query',
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) => useAliasProductQueryFactory(queryType, options);

/**
 * Return the graph query based off of tally and capacity.
 *
 * @param {object} options
 * @param {string} options.queryType
 * @param {object} options.schemaCheck
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductQueryFactory
 * @param {object} options.options
 * @returns {object}
 */
const useProductGraphTallyQuery = ({
  queryType = 'graphTallyQuery',
  schemaCheck = rhsmConstants.RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) =>
  reduxHelpers.setApiQuery(
    {
      ...useAliasProductQuery(),
      ...useAliasProductQueryFactory(queryType, options)
    },
    schemaCheck
  );

/**
 * Return the inventory query for guests. Use fallback/defaults for guests offset, limit.
 *
 * @param {object} options
 * @param {string} options.queryType
 * @param {object} options.schemaCheck
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductQueryFactory
 * @param {object} options.options
 * @returns {object}
 */
const useProductInventoryGuestsQuery = ({
  queryType = 'inventoryGuestsQuery',
  schemaCheck = rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) =>
  reduxHelpers.setApiQuery(
    {
      ...useAliasProductQuery(),
      ...useAliasProductQueryFactory(queryType, options)
    },
    schemaCheck
  );

/**
 * Return an inventory query for hosts.
 *
 * @param {object} options
 * @param {string} options.queryType
 * @param {object} options.schemaCheck
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductQueryFactory
 * @param {object} options.options
 * @returns {object}
 */
const useProductInventoryHostsQuery = ({
  queryType = 'inventoryHostsQuery',
  schemaCheck = rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) =>
  reduxHelpers.setApiQuery(
    {
      ...useAliasProductQuery(),
      ...useAliasProductQueryFactory(queryType, options)
    },
    schemaCheck
  );

/**
 * Return an inventory query for subscriptions.
 *
 * @param {object} options
 * @param {string} options.queryType
 * @param {object} options.schemaCheck
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductQueryFactory
 * @param {object} options.options
 * @returns {object}
 */
const useProductInventorySubscriptionsQuery = ({
  queryType = 'inventorySubscriptionsQuery',
  schemaCheck = rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) =>
  reduxHelpers.setApiQuery(
    {
      ...useAliasProductQuery(),
      ...useAliasProductQueryFactory(queryType, options)
    },
    schemaCheck
  );

/**
 * Return a unified query for toolbars
 *
 * @param {object} options
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductGraphTallyQuery
 * @param {Function} options.useProductInventoryHostsQuery
 * @param {Function} options.useProductInventorySubscriptionsQuery
 * @param {object} options.options
 * @returns {object}
 */
const useProductToolbarQuery = ({
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery,
  useProductInventoryHostsQuery: useAliasProductInventoryHostsQuery = useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery:
    useAliasProductInventorySubscriptionsQuery = useProductInventorySubscriptionsQuery,
  options
} = {}) => ({
  ...useAliasProductQuery({ options }),
  ...useAliasProductGraphTallyQuery({ options }),
  ...useAliasProductInventoryHostsQuery({ options }),
  ...useAliasProductInventorySubscriptionsQuery({ options })
});

/**
 * Get a filtered product configuration context.
 *
 * @param {object} options
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductViewContext
 * @returns {object}
 */
const useProductContext = ({
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductViewContext: useAliasProductViewContext = useProductViewContext
} = {}) => {
  const { [RHSM_API_QUERY_SET_TYPES.UOM]: uomFilter } = useAliasProductQuery();
  const {
    initialGraphFilters = [],
    initialInventoryFilters = [],
    initialSubscriptionsInventoryFilters = [],
    productContextFilterUom,
    ...config
  } = useAliasProductViewContext();

  const applyUomFilter = useCallback(() => {
    if (productContextFilterUom === true) {
      const filterFilters = ({ id, metric, isOptional }) => {
        if (!isOptional) {
          return true;
        }
        return new RegExp(uomFilter, 'i').test(metric) || new RegExp(uomFilter, 'i').test(id);
      };

      /**
       * Allowing nested filters beside normal filters we take the quick path, just run the loop twice.
       * Make sure to set "isOptional" false when it comes to nested filters in the event someone
       * combined a config setting in the subsequent loop.
       */
      const updatedGraphFilters = _cloneDeep(initialGraphFilters)
        .map(({ filters, ...rest }) => ({
          ...rest,
          filters: filters.filter(filterFilters),
          isOptional: false
        }))
        .filter(filterFilters);

      return {
        ...config,
        initialGraphFilters: updatedGraphFilters,
        initialInventoryFilters: initialInventoryFilters.filter(filterFilters),
        initialSubscriptionsInventoryFilters: initialSubscriptionsInventoryFilters.filter(filterFilters)
      };
    }

    return {
      ...config,
      initialGraphFilters,
      initialInventoryFilters,
      initialSubscriptionsInventoryFilters
    };
  }, [
    config,
    initialGraphFilters,
    initialInventoryFilters,
    initialSubscriptionsInventoryFilters,
    productContextFilterUom,
    uomFilter
  ]);

  return applyUomFilter();
};

/**
 * Return product identifiers.
 *
 * @param {object} options
 * @param {Function} options.useProductViewContext
 * @returns {{productLabel, viewId, productId, productGroup, productVariants}}
 */
const useProduct = ({ useProductViewContext: useAliasProductViewContext = useProductViewContext } = {}) => {
  const { productGroup, productId, productLabel, productVariants, viewId } = useAliasProductViewContext();
  return {
    productGroup,
    productId,
    productLabel,
    productVariants,
    viewId
  };
};

/**
 * Return graph configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductContext
 * @returns {{settings: object, filters: Array}}
 */
const useProductGraphConfig = ({ useProductContext: useAliasProductContext = useProductContext } = {}) => {
  const { initialGraphFilters, initialGraphSettings = {} } = useAliasProductContext();
  return {
    filters: initialGraphFilters,
    settings: initialGraphSettings
  };
};

/**
 * Return guests inventory configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductContext
 * @returns {{settings: object, filters: Array}}
 */
const useProductInventoryGuestsConfig = ({ useProductContext: useAliasProductContext = useProductContext } = {}) => {
  const { inventoryGuestsQuery = {}, initialGuestsFilters, initialGuestsSettings = {} } = useAliasProductContext();
  return {
    filters: initialGuestsFilters,
    initialQuery: inventoryGuestsQuery,
    settings: initialGuestsSettings
  };
};

/**
 * Return inventory configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductContext
 * @returns {{settings: object, filters: Array}}
 */
const useProductInventoryHostsConfig = ({ useProductContext: useAliasProductContext = useProductContext } = {}) => {
  const { initialInventoryFilters, initialInventorySettings = {} } = useAliasProductContext();
  return {
    filters: initialInventoryFilters,
    settings: initialInventorySettings
  };
};

/**
 * Return subscriptions inventory configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductContext
 * @returns {{settings: object, filters: Array}}
 */
const useProductInventorySubscriptionsConfig = ({
  useProductContext: useAliasProductContext = useProductContext
} = {}) => {
  const { initialSubscriptionsInventoryFilters, initialSubscriptionsInventorySettings = {} } = useAliasProductContext();
  return {
    filters: initialSubscriptionsInventoryFilters,
    settings: initialSubscriptionsInventorySettings
  };
};

/**
 * Return primary toolbar configuration.
 *
 * @param {object} options
 * @param {Function} options.useProductContext
 * @returns {{settings: object, filters: Array}}
 */
const useProductToolbarConfig = ({ useProductContext: useAliasProductContext = useProductContext } = {}) => {
  const { initialToolbarFilters, initialToolbarSettings = {} } = useAliasProductContext();
  return {
    filters: initialToolbarFilters,
    settings: initialToolbarSettings
  };
};

const context = {
  ProductViewContext,
  DEFAULT_CONTEXT,
  useProductContext,
  useQuery: useProductQuery,
  useQueryFactory: useProductQueryFactory,
  useGraphTallyQuery: useProductGraphTallyQuery,
  useInventoryGuestsQuery: useProductInventoryGuestsQuery,
  useInventoryHostsQuery: useProductInventoryHostsQuery,
  useInventorySubscriptionsQuery: useProductInventorySubscriptionsQuery,
  useProduct,
  useGraphConfig: useProductGraphConfig,
  useInventoryGuestsConfig: useProductInventoryGuestsConfig,
  useInventoryHostsConfig: useProductInventoryHostsConfig,
  useInventorySubscriptionsConfig: useProductInventorySubscriptionsConfig,
  useToolbarConfig: useProductToolbarConfig,
  useToolbarQuery: useProductToolbarQuery
};

export {
  context as default,
  context,
  ProductViewContext,
  DEFAULT_CONTEXT,
  useProductContext,
  useProductQuery,
  useProductQueryFactory,
  useProductGraphTallyQuery,
  useProductInventoryGuestsQuery,
  useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery,
  useProduct,
  useProductGraphConfig,
  useProductInventoryGuestsConfig,
  useProductInventoryHostsConfig,
  useProductInventorySubscriptionsConfig,
  useProductToolbarConfig,
  useProductToolbarQuery
};
