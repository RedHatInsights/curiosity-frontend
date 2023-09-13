import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import {
  useProduct,
  useProductInventorySubscriptionsConfig,
  useProductInventorySubscriptionsQuery
} from '../productView/productViewContext';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';
import {
  useGetInstancesInventory,
  useInventoryCardActionsInstances,
  useParseInstancesFiltersSettings,
  useSelectorInstances
} from '../inventoryCardInstances/inventoryCardInstancesContext';
import { tableHelpers } from '../table/table';

/**
 * @memberof InventoryCardSubscriptions
 * @module InventoryCardSubscriptionsContext
 */

/**
 * Parse filters settings for context.
 * See @module InventoryCardInstancesContext
 *
 * @param {object} options
 * @param {boolean} options.isDisabled
 * @param {Function} options.useParseFiltersSettings
 * @param {Function} options.useProductConfig
 * @returns {{settings: {}, columnCountAndWidths: {count: number, widths: Array}, filters: Array}}
 */
const useParseSubscriptionsFiltersSettings = ({
  isDisabled = false,
  useParseFiltersSettings: useAliasParseFiltersSettings = useParseInstancesFiltersSettings,
  useProductConfig: useAliasProductConfig = useProductInventorySubscriptionsConfig
} = {}) =>
  useAliasParseFiltersSettings({
    isDisabled,
    useProductConfig: useAliasProductConfig
  });

/**
 * Parse selector response for consuming components.
 * See @module InventoryCardInstancesContext
 *
 * @param {object} options
 * @param {string} options.storeRef
 * @param {Function} options.useParseFiltersSettings
 * @param {Function} options.useProductInventoryQuery
 * @param {Function} options.useSelector
 * @returns {{pending: boolean, fulfilled: boolean, error: boolean, resultsColumnCountAndWidths: {count: number,
 *     widths: Array}, dataSetColumnHeaders: Array, resultsPerPage: number, resultsOffset: number, dataSetRows: Array,
 *     resultsCount: number}}
 */
const useSelectorSubscriptions = ({
  storeRef = 'subscriptionsInventory',
  useParseFiltersSettings: useAliasParseFiltersSettings = useParseSubscriptionsFiltersSettings,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventorySubscriptionsQuery,
  useSelector: useAliasSelector = useSelectorInstances
} = {}) =>
  useAliasSelector({
    storeRef,
    useParseFiltersSettings: useAliasParseFiltersSettings,
    useProductInventoryQuery: useAliasProductInventoryQuery
  });

/**
 * Combine service call, Redux, and inventory selector response.
 * See @module InventoryCardInstancesContext
 *
 * @param {object} options
 * @param {boolean} options.isDisabled
 * @param {Function} options.getInventory
 * @param {Function} options.useGetInventory
 * @param {Function} options.useProductInventoryQuery
 * @param {Function} options.useSelector
 * @returns {{pending: boolean, fulfilled: boolean, error: boolean, resultsColumnCountAndWidths: {count: number,
 *     widths: Array}, dataSetColumnHeaders: Array, resultsPerPage: number, resultsOffset: number, dataSetRows: Array,
 *     resultsCount: number}}
 */
const useGetSubscriptionsInventory = ({
  isDisabled = false,
  getInventory = reduxActions.rhsm.getSubscriptionsInventory,
  useGetInventory: useAliasGetInventory = useGetInstancesInventory,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventorySubscriptionsQuery,
  useSelector: useAliasSelector = useSelectorSubscriptions
} = {}) =>
  useAliasGetInventory({
    isDisabled,
    getInventory,
    useProductInventoryQuery: useAliasProductInventoryQuery,
    useSelector: useAliasSelector
  });

/**
 * Return a component list for a configurable inventoryCard action toolbar.
 * Allow the "content" prop to receive inventory data for display via callback.
 * See @module InventoryCardInstancesContext
 *
 * @param {object} options
 * @param {Function} options.useInventoryCardActions
 * @param {Function} options.useSelector
 * @param {Function} options.useProductConfig
 * @returns {Array}
 */
const useInventoryCardActionsSubscriptions = ({
  useInventoryCardActions: useAliasInventoryCardActions = useInventoryCardActionsInstances,
  useSelector: useAliasSelector = useSelectorSubscriptions,
  useProductConfig: useAliasProductConfig = useProductInventorySubscriptionsConfig
} = {}) => useAliasInventoryCardActions({ useSelector: useAliasSelector, useProductConfig: useAliasProductConfig });

/**
 * An onPage callback for inventory.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnPageSubscriptions = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  /**
   * On event update state for inventory.
   *
   * @event onPage
   * @param {object} params
   * @param {number} params.offset
   * @param {number} params.perPage
   * @returns {void}
   */
  return ({ offset, perPage }) => {
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.OFFSET],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: offset
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.LIMIT],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: perPage
      }
    ]);
  };
};

/**
 * An onColumnSort callback for inventory.
 *
 * @param {object} options
 * @param {object} options.sortColumns
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnColumnSortSubscriptions = ({
  sortColumns = SORT_TYPES,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  /**
   * On event update state for inventory.
   *
   * @event onColumnSort
   * @param {object} params
   * @param {string} params.direction
   * @param {object} params.data
   * @returns {void}
   */
  return ({ direction, data = {} }) => {
    const { metric: id } = data;
    const updatedSortColumn = Object.values(sortColumns).find(value => value === id);
    let updatedDirection;

    if (!updatedSortColumn) {
      if (helpers.DEV_MODE || helpers.REVIEW_MODE) {
        console.warn(`Sorting can only be performed on select fields, confirm field ${id} is allowed.`);
      }
      return;
    }

    switch (direction) {
      case tableHelpers.SortByDirectionVariant.desc:
        updatedDirection = SORT_DIRECTION_TYPES.DESCENDING;
        break;
      default:
        updatedDirection = SORT_DIRECTION_TYPES.ASCENDING;
        break;
    }

    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.DIRECTION],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.DIRECTION]: updatedDirection
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.SORT],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.SORT]: updatedSortColumn
      }
    ]);
  };
};

const context = {
  useGetSubscriptionsInventory,
  useInventoryCardActionsSubscriptions,
  useOnPageSubscriptions,
  useOnColumnSortSubscriptions,
  useParseSubscriptionsFiltersSettings,
  useSelectorSubscriptions
};

export {
  context as default,
  context,
  useGetSubscriptionsInventory,
  useInventoryCardActionsSubscriptions,
  useOnPageSubscriptions,
  useOnColumnSortSubscriptions,
  useParseSubscriptionsFiltersSettings,
  useSelectorSubscriptions
};
