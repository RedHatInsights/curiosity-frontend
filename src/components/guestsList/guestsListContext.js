import { useUnmount, useShallowCompareEffect } from 'react-use';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProductInventoryGuestsQuery } from '../productView/productViewContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';

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
    ({ inventory }) => inventory?.hostsGuests?.[id]
  );

  return {
    error,
    fulfilled,
    pending: pending || cancelled || false,
    data: (data?.length === 1 && data[0]) || data || {}
  };
};

/**
 * Combined Redux RHSM Actions, getHostsInventoryGuests, and inventory selector response.
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
    getInventory = reduxActions.rhsm.getHostsInventoryGuests,
    useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
    useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryGuestsQuery,
    useSelectorsInventory: useAliasSelectorsInventory = useSelectorsGuestsInventory
  } = {}
) => {
  const query = useAliasProductInventoryQuery({ options: { overrideId: id } });
  const dispatch = useAliasDispatch();
  const response = useAliasSelectorsInventory(id);

  useShallowCompareEffect(() => {
    getInventory(id, query)(dispatch);
  }, [dispatch, id, query]);

  return {
    ...response
  };
};

/**
 * Use paging as onScroll event for guests inventory.
 *
 * @param {string} id
 * @param {Function} successCallback
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useSelectorsInventory
 * @param {Function} options.useProductInventoryQuery
 * @returns {Function}
 */
const useOnScroll = (
  id,
  successCallback,
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

    if (numberOfGuests > (currentPage + 1) * limit && bottom && !pending) {
      if (typeof successCallback === 'function') {
        successCallback(event);
      }

      dispatch([
        {
          type: reduxTypes.query.SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.OFFSET],
          viewId: id,
          [RHSM_API_QUERY_SET_TYPES.OFFSET]: currentPage + 1
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
