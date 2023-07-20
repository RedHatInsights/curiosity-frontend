import { useState } from 'react';
import { useDeepCompareEffect, useUnmount, useShallowCompareEffect } from 'react-use';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProductInventoryGuestsQuery } from '../productView/productViewContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';

/**
 * @memberof InventoryGuests
 * @module InventoryGuestsContext
 */

/**
 * Guests inventory selector response.
 *
 * @param {string} id
 * @param {object} options
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: (*|{}), pending: (*|boolean), fulfilled, error}}
 */
const useSelectorsGuestsInventory = (
  id,
  { useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse } = {}
) => {
  const { error, cancelled, fulfilled, pending, data } = useAliasSelectorsResponse(
    ({ inventory }) => inventory?.instancesGuests?.[id]
  );

  return {
    error,
    fulfilled,
    pending: pending || cancelled || false,
    data: (data?.length === 1 && data[0]) || data || {}
  };
};

/**
 * Combined Redux RHSM Actions, getInstancesInventoryGuests, and inventory selector response.
 *
 * @param {string} id
 * @param {object} options
 * @param {Function} options.getInventory
 * @param {Function} options.useDispatch
 * @param {Function} options.useProductInventoryQuery
 * @param {Function} options.useSelectorsInventory
 * @returns {Function}
 */
const useGetGuestsInventory = (
  id,
  {
    getInventory = reduxActions.rhsm.getInstancesInventoryGuests,
    useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
    useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryGuestsQuery,
    useSelectorsInventory: useAliasSelectorsInventory = useSelectorsGuestsInventory
  } = {}
) => {
  const [updatedData, setUpdatedData] = useState([]);
  const query = useAliasProductInventoryQuery({ options: { overrideId: id } });
  const dispatch = useAliasDispatch();
  const { data = {}, fulfilled = false, ...response } = useAliasSelectorsInventory(id);
  const { data: listData = [] } = data;

  useShallowCompareEffect(() => {
    getInventory(id, query)(dispatch);
  }, [dispatch, id, query]);

  useDeepCompareEffect(() => {
    if (fulfilled) {
      setUpdatedData(prevState => [...prevState, ...listData]);
    }
  }, [fulfilled, listData]);

  return {
    data: updatedData,
    fulfilled,
    ...response
  };
};

/**
 * Use paging as onScroll event for guests inventory.
 *
 * @param {string} id
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelectorsInventory
 * @param {Function} options.useProductInventoryQuery
 * @returns {Function}
 */
const useOnScroll = (
  id,
  {
    useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
    useSelectorsInventory: useAliasSelectorsInventory = useSelectorsGuestsInventory,
    useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryGuestsQuery
  } = {}
) => {
  const dispatch = useAliasDispatch();
  const { pending, data = {} } = useAliasSelectorsInventory(id);
  const { count: numberOfGuests } = data?.meta || {};

  const query = useAliasProductInventoryQuery({ options: { overrideId: id } });
  const { [RHSM_API_QUERY_SET_TYPES.LIMIT]: limit, [RHSM_API_QUERY_SET_TYPES.OFFSET]: currentPage } = query;

  /**
   * Reset paging in scenarios where inventory is filtered, or guests is collapsed.
   */
  useUnmount(() => {
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST,
        viewId: id
      },
      {
        type: reduxTypes.inventory.CLEAR_INVENTORY_GUESTS,
        id
      }
    ]);
  });

  /**
   * On scroll, dispatch type.
   *
   * @event onScroll
   * @param {object} event
   * @returns {void}
   */
  return event => {
    const { target } = event;
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;

    if (numberOfGuests > currentPage + limit && bottom && !pending) {
      dispatch([
        {
          type: reduxTypes.query.SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.OFFSET],
          viewId: id,
          [RHSM_API_QUERY_SET_TYPES.OFFSET]: currentPage + limit
        },
        {
          type: reduxTypes.query.SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.LIMIT],
          viewId: id,
          [RHSM_API_QUERY_SET_TYPES.LIMIT]: limit
        }
      ]);
    }
  };
};

const context = {
  useGetGuestsInventory,
  useOnScroll,
  useSelectorsGuestsInventory
};

export { context as default, context, useGetGuestsInventory, useOnScroll, useSelectorsGuestsInventory };
