import React, { useMemo } from 'react';
import { useShallowCompareEffect } from 'react-use';
import { ToolbarItem } from '@patternfly/react-core';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useSession } from '../authentication/authenticationContext';
import {
  useProduct,
  useProductInventoryGuestsConfig,
  useProductInventoryHostsConfig,
  useProductInventoryHostsQuery
} from '../productView/productViewContext';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';
import { inventoryCardHelpers } from '../inventoryCard/inventoryCardHelpers';
import { tableHelpers } from '../table/table';
import { toolbarFieldOptions } from '../toolbar/toolbarFieldSelectCategory';
import { InventoryGuests } from '../inventoryGuests/inventoryGuests'; // eslint-disable-line

/**
 * @memberof InventoryCardInstances
 * @module InventoryCardInstancesContext
 */

/**
 * Parse filters settings for context.
 *
 * @param {object} options
 * @param {boolean} options.isDisabled
 * @param {Function} options.useProduct
 * @param {Function} options.useProductConfig
 * @returns {{settings: {}, columnCountAndWidths: {count: number, widths: Array}, filters: Array}}
 */
const useParseInstancesFiltersSettings = ({
  isDisabled = false,
  useProduct: useAliasProduct = useProduct,
  useProductConfig: useAliasProductConfig = useProductInventoryHostsConfig,
  useProductGuestsConfig: useAliasProductGuestsConfig = useProductInventoryGuestsConfig
} = {}) => {
  const { productId } = useAliasProduct();
  const { filters = [], settings = {} } = useAliasProductConfig();
  const { filters: guestFilters = [] } = useAliasProductGuestsConfig();

  return useMemo(() => {
    if (isDisabled) {
      return undefined;
    }
    return inventoryCardHelpers.normalizeInventorySettings({
      filters,
      guestFilters,
      settings,
      productId
    });
  }, [filters, guestFilters, isDisabled, settings, productId]);
};

/**
 * Parse selector response for consuming components.
 *
 * @param {object} options
 * @param {string} options.storeRef
 * @param {Function} options.useParseFiltersSettings
 * @param {Function} options.useProduct
 * @param {Function} options.useProductInventoryQuery
 * @param {Function} options.useSelectorsResponse
 * @param {Function} options.useSession
 * @returns {{pending: boolean, fulfilled: boolean, error: boolean, resultsColumnCountAndWidths: {count: number,
 *     widths: Array}, dataSetColumnHeaders: Array, resultsPerPage: number, resultsOffset: number, dataSetRows: Array,
 *     resultsCount: number}}
 */
const useSelectorInstances = ({
  storeRef = 'instancesInventory',
  useParseFiltersSettings: useAliasParseFiltersSettings = useParseInstancesFiltersSettings,
  useProduct: useAliasProduct = useProduct,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryHostsQuery,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse,
  useSession: useAliasSession = useSession
} = {}) => {
  const { productId } = useAliasProduct();
  const session = useAliasSession();
  const query = useAliasProductInventoryQuery();
  const { columnCountAndWidths, filters, isGuestFiltersDisabled, settings } = useAliasParseFiltersSettings();
  const response = useAliasSelectorsResponse(({ inventory }) => inventory?.[storeRef]?.[productId]);

  const { pending, cancelled, data, ...restResponse } = response;
  const updatedPending = pending || cancelled || false;
  let parsedData;

  if (response?.fulfilled) {
    const updatedData = (data?.length === 1 && data[0]) || data || {};
    parsedData = inventoryCardHelpers.parseInventoryResponse({
      data: updatedData,
      filters,
      GuestComponent: InventoryGuests,
      isGuestFiltersDisabled,
      query,
      session,
      settings
    });
  }

  return {
    ...restResponse,
    pending: updatedPending,
    resultsColumnCountAndWidths: columnCountAndWidths,
    ...parsedData
  };
};

/**
 * Combine service call, Redux, and inventory selector response.
 *
 * @param {object} options
 * @param {boolean} options.isDisabled
 * @param {Function} options.getInventory
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useProductInventoryQuery
 * @param {Function} options.useSelector
 * @returns {{pending: boolean, fulfilled: boolean, error: boolean, resultsColumnCountAndWidths: {count: number,
 *     widths: Array}, dataSetColumnHeaders: Array, resultsPerPage: number, resultsOffset: number, dataSetRows: Array,
 *     resultsCount: number}}
 */
const useGetInstancesInventory = ({
  isDisabled = false,
  getInventory = reduxActions.rhsm.getInstancesInventory,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryHostsQuery,
  useSelector: useAliasSelector = useSelectorInstances
} = {}) => {
  const { productId } = useAliasProduct();
  const query = useAliasProductInventoryQuery();
  const dispatch = useAliasDispatch();
  const response = useAliasSelector();

  useShallowCompareEffect(() => {
    if (!isDisabled) {
      getInventory(productId, query)(dispatch);
    }
  }, [isDisabled, productId, query]);

  return response;
};

/**
 * Return a component list for a configurable inventoryCard action toolbar.
 * Allow the "content" prop to receive inventory data for display via callback.
 *
 * @param {object} options
 * @param {Array} options.categoryOptions
 * @param {Function} options.useSelector
 * @param {Function} options.useProductConfig
 * @returns {Array}
 */
const useInventoryCardActionsInstances = ({
  categoryOptions = toolbarFieldOptions,
  useSelector: useAliasSelector = useSelectorInstances,
  useProductConfig: useAliasProductConfig = useProductInventoryHostsConfig
} = {}) => {
  const results = useAliasSelector();
  const { pending, resultsCount } = results;
  const { settings = {} } = useAliasProductConfig();
  const { actions } = settings;

  return useMemo(
    () =>
      actions?.map(({ id, content, ...actionProps }) => {
        const option = categoryOptions.find(({ value: categoryOptionValue }) => id === categoryOptionValue);
        const { component: OptionComponent } = option || {};

        return (
          (OptionComponent && (
            <ToolbarItem key={`option-${id}`}>
              <OptionComponent isFilter={false} {...actionProps} />
            </ToolbarItem>
          )) ||
          (content && !pending && resultsCount && (
            <ToolbarItem key={id || helpers.generateId()}>
              {typeof content === 'function' ? content({ data: results }) : content}
            </ToolbarItem>
          )) ||
          null
        );
      }),
    [actions, categoryOptions, results, resultsCount, pending]
  );
};

/**
 * An onPage callback for inventory.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnPageInstances = ({
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
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.OFFSET],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: offset
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.LIMIT],
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
const useOnColumnSortInstances = ({
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
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.DIRECTION],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.DIRECTION]: updatedDirection
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.SORT],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.SORT]: updatedSortColumn
      }
    ]);
  };
};

const context = {
  useGetInstancesInventory,
  useInventoryCardActionsInstances,
  useOnPageInstances,
  useOnColumnSortInstances,
  useParseInstancesFiltersSettings,
  useSelectorInstances
};

export {
  context as default,
  context,
  useGetInstancesInventory,
  useInventoryCardActionsInstances,
  useOnPageInstances,
  useOnColumnSortInstances,
  useParseInstancesFiltersSettings,
  useSelectorInstances
};
