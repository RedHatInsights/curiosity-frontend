import React, { useContext, useEffect, useMemo } from 'react';
import { useSession } from '../authentication/authenticationContext';
import { reduxActions, reduxHelpers, storeHooks } from '../../redux';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { platformConstants } from '../../services/platform/platformConstants';
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
 * @param {string} queryType An identifier used to pull from both config and Redux, they should be named the same.
 * @param {object} options
 * @param {string} [options.overrideId] A custom identifier, used for scenarios like the Guest inventory IDs
 * @param {useProductViewContext} [options.useProductViewContext=useProductViewContext]
 * @param {storeHooks.reactRedux.useSelectors} [options.useSelectors=storeHooks.reactRedux.useSelectors]
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
 * Return the billing account id base query, sans-productId.
 * Note: The billing accounts query is a one-off when compared to other API calls. We align
 * the productId use with ALL API calls by passing it separately instead of with this query.
 *
 * @param {object} options
 * @param {string} [options.queryType='billingAccountsQuery']
 * @param {object} [options.schemaCheck=rhsmConstants.RHSM_API_QUERY_SET_BILLING_ACCOUNT_ID_TYPES]
 * @param {useProductQueryFactory} [options.useProductQueryFactory=useProductQueryFactory]
 * @param {useSession} [options.useSession=useSession]
 * @param {object} [options.options]
 * @returns {object}
 */
const useProductBillingAccountsQuery = ({
  queryType = 'billingAccountsQuery',
  schemaCheck = rhsmConstants.RHSM_API_QUERY_SET_BILLING_ACCOUNT_ID_TYPES,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  useSession: useAliasSession = useSession,
  options
} = {}) => {
  const { orgId } = useAliasSession();
  return reduxHelpers.setApiQuery(
    {
      ...useAliasProductQueryFactory(queryType, options),
      [rhsmConstants.RHSM_API_QUERY_SET_BILLING_ACCOUNT_ID_TYPES.ORG_ID]: orgId
    },
    schemaCheck
  );
};

/**
 * Return a product query based on potential product configuration "onload".
 *
 * @param {object} options
 * @param {useProductViewContext} [options.useProductViewContext=useProductViewContext]
 * @param {storeHooks.reactRedux.useSelectors} [options.useSelectors=storeHooks.reactRedux.useSelectors]
 * @returns {object}
 */
const useProductQueryConditional = ({
  useProductViewContext: useAliasProductViewContext = useProductViewContext,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors
} = {}) => {
  const { productId } = useAliasProductViewContext();
  const { billing = {} } = useAliasSelectors([
    { id: 'billing', selector: ({ app }) => app?.billingAccounts?.[productId] }
  ]);

  return useMemo(
    () => ({
      [rhsmConstants.RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: billing?.data?.defaultProvider || undefined,
      [rhsmConstants.RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID]: billing?.data?.defaultAccount || undefined
    }),
    [billing?.data?.defaultAccount, billing?.data?.defaultProvider]
  );
};

/**
 * Return a base product query
 *
 * @param {object} options
 * @param {string} [options.queryType='query']
 * @param {useProductQueryConditional} [options.useProductQueryConditional=useProductQueryConditional]
 * @param {useProductQueryFactory} [options.useProductQueryFactory=useProductQueryFactory]
 * @param {object} options.options
 * @returns {object}
 */
const useProductQuery = ({
  queryType = 'query',
  useProductQueryConditional: useAliasProductQueryConditional = useProductQueryConditional,
  useProductQueryFactory: useAliasProductQueryFactory = useProductQueryFactory,
  options
} = {}) => ({
  ...useAliasProductQueryConditional(),
  ...useAliasProductQueryFactory(queryType, options)
});

/**
 * Return the graph query based off of tally and capacity.
 *
 * @param {object} options
 * @param {string} [options.queryType='graphTallyQuery']
 * @param {object} [options.schemaCheck=rhsmConstants.RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES]
 * @param {useProductQuery} [options.useProductQuery=useProductQuery]
 * @param {useProductQueryFactory} [options.useProductQueryFactory=useProductQueryFactory]
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
 * @param {string} [options.queryType='inventoryGuestsQuery']
 * @param {object} [options.schemaCheck=rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES]
 * @param {useProductQuery} [options.useProductQuery=useProductQuery]
 * @param {useProductQueryFactory} [options.useProductQueryFactory=useProductQueryFactory]
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
 * @param {string} [options.queryType='inventoryHostsQuery']
 * @param {object} [options.schemaCheck=rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES]
 * @param {useProductQuery} [options.useProductQuery=useProductQuery]
 * @param {useProductQueryFactory} [options.useProductQueryFactory=useProductQueryFactory]
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
 * @param {string} [options.queryType='inventorySubscriptionsQuery']
 * @param {object} [options.schemaCheck=rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES]
 * @param {useProductQuery} [options.useProductQuery=useProductQuery]
 * @param {useProductQueryFactory} [options.useProductQueryFactory=useProductQueryFactory]
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
 * @param {useProductQuery} [options.useProductQuery=useProductQuery]
 * @param {useProductGraphTallyQuery} [options.useProductGraphTallyQuery=useProductGraphTallyQuery]
 * @param {useProductInventoryHostsQuery} [options.useProductInventoryHostsQuery=useProductInventoryHostsQuery]
 * @param {useProductInventorySubscriptionsQuery} [options.useProductInventorySubscriptionsQuery]
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
 * @param {useProductContext} [options.useProductViewContext=useProductContext]
 * @returns {object}
 */
const useProductContext = ({ useProductViewContext: useAliasProductViewContext = useProductViewContext } = {}) =>
  useAliasProductViewContext();

/**
 * Return product identifiers.
 *
 * @param {object} options
 * @param {useProductContext} [options.useProductViewContext=useProductContext]
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
 * @param {useProductContext} [options.useProductContext=useProductContext]
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
 * @param {useProductContext} [options.useProductContext=useProductContext]
 * @returns {{settings: object, initialQuery: object, filters: Array}}
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
 * @param {useProductContext} [options.useProductContext=useProductContext]
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
 * @param {useProductContext} [options.useProductContext=useProductContext]
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
 * @param {useProductContext} [options.useProductContext=useProductContext]
 * @returns {{settings: object, filters: Array}}
 */
const useProductToolbarConfig = ({ useProductContext: useAliasProductContext = useProductContext } = {}) => {
  const { initialToolbarFilters, initialToolbarSettings = {} } = useAliasProductContext();
  return {
    filters: initialToolbarFilters,
    settings: initialToolbarSettings
  };
};

/**
 * Return an export query for subscriptions.
 *
 * @param {object} options
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {object} [options.schemaCheck=platformConstants.PLATFORM_API_EXPORT_POST_SUBSCRIPTIONS_FILTER_TYPES]
 * @param {useProductToolbarQuery} [options.useProductToolbarQuery=useProductToolbarQuery]
 * @param {object} options.options
 * @returns {{}}
 */
const useProductExportQuery = ({
  useProduct: useAliasProduct = useProduct,
  schemaCheck = platformConstants.PLATFORM_API_EXPORT_POST_SUBSCRIPTIONS_FILTER_TYPES,
  useProductToolbarQuery: useAliasProductToolbarQuery = useProductToolbarQuery,
  options
} = {}) => {
  const { productId } = useAliasProduct();
  return reduxHelpers.setApiQuery(
    {
      ...useAliasProductToolbarQuery({ options }),
      [platformConstants.PLATFORM_API_EXPORT_POST_SUBSCRIPTIONS_FILTER_TYPES.PRODUCT_ID]: productId
    },
    schemaCheck
  );
};

/**
 * Onload product conditionally dispatch services.
 *
 * @param {object} options
 * @param {reduxActions.rhsm.getBillingAccounts} [options.getBillingAccounts=reduxActions.rhsm.getBillingAccounts]
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProductViewContext} [options.useProductViewContext=useProductViewContext]
 * @param {useProductBillingAccountsQuery} [options.useProductBillingAccountsQuery=useProductBillingAccountsQuery]
 * @param {storeHooks.reactRedux.useSelectorsResponse} [options.useSelectorsResponse=useSelectorsResponse]
 * @returns {{data: object, productId: string, pending: boolean, isReady: boolean, fulfilled: boolean,
 *     responses: object}}
 */
const useProductOnload = ({
  getBillingAccounts = reduxActions.rhsm.getBillingAccounts,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProductViewContext: useAliasProductViewContext = useProductViewContext,
  useProductBillingAccountsQuery: useAliasProductBillingAccountsQuery = useProductBillingAccountsQuery,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { onloadProduct, productId } = useAliasProductViewContext();
  const billingAccountsQuery = useAliasProductBillingAccountsQuery();
  const dispatch = useAliasDispatch();
  const isBillingAccountRequired =
    onloadProduct?.find(value => value === rhsmConstants.RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID) !== undefined;

  const selectors = [];
  if (isBillingAccountRequired) {
    selectors.push({ id: 'billing', selector: ({ app }) => app.billingAccounts?.[productId] });
  }
  const response = useAliasSelectorsResponse(selectors);

  useEffect(() => {
    if (isBillingAccountRequired) {
      dispatch(getBillingAccounts(productId, billingAccountsQuery));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBillingAccountRequired, productId]);

  return {
    ...response,
    isReady: !onloadProduct?.length || response?.fulfilled || false,
    productId
  };
};

const context = {
  ProductViewContext,
  DEFAULT_CONTEXT,
  useProductContext,
  useQuery: useProductQuery,
  useQueryFactory: useProductQueryFactory,
  useQueryConditional: useProductQueryConditional,
  useBillingAccountsQuery: useProductBillingAccountsQuery,
  useGraphTallyQuery: useProductGraphTallyQuery,
  useInventoryGuestsQuery: useProductInventoryGuestsQuery,
  useInventoryHostsQuery: useProductInventoryHostsQuery,
  useInventorySubscriptionsQuery: useProductInventorySubscriptionsQuery,
  useProduct,
  useProductOnload,
  useProductExportQuery,
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
  useProductQueryConditional,
  useProductBillingAccountsQuery,
  useProductGraphTallyQuery,
  useProductInventoryGuestsQuery,
  useProductInventoryHostsQuery,
  useProductInventorySubscriptionsQuery,
  useProduct,
  useProductOnload,
  useProductExportQuery,
  useProductGraphConfig,
  useProductInventoryGuestsConfig,
  useProductInventoryHostsConfig,
  useProductInventorySubscriptionsConfig,
  useProductToolbarConfig,
  useProductToolbarQuery
};
