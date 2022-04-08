import { useShallowCompareEffect } from 'react-use';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductQuery } from '../productView/productViewContext';
import { dateHelpers } from '../../common';
import {
  rhsmConstants,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';

/**
 * Get app messages.
 *
 * @param {object} options
 * @param {Function} options.getMessageReports
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useProductQuery
 * @param {Function} options.useSelectorsResponse
 * @returns {object}
 */
const useGetAppMessages = ({
  getMessageReports = reduxActions.rhsm.getMessageReports,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { productId } = useAliasProduct();
  const query = useAliasProductQuery();
  const dispatch = useAliasDispatch();
  const { error, fulfilled, pending, data } = useAliasSelectorsResponse({
    id: 'messages',
    selector: ({ messages }) => messages?.report?.[productId]
  });

  useShallowCompareEffect(() => {
    if (productId) {
      const { startDate, endDate } = dateHelpers.getRangedDateTime('CURRENT');
      const updatedQuery = {
        ...query,
        [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate.toISOString(),
        [RHSM_API_QUERY_SET_TYPES.END_DATE]: endDate.toISOString()
      };

      getMessageReports(productId, updatedQuery)(dispatch);
    }
  }, [productId, query]);

  const updatedData = {
    cloudigradeMismatch: false
  };

  if (fulfilled) {
    const { messages = {} } = data || {};

    updatedData.cloudigradeMismatch =
      messages?.data
        ?.reverse()
        ?.find(
          ({ [rhsmConstants.RHSM_API_RESPONSE_TALLY_META_TYPES.HAS_CLOUDIGRADE_MISMATCH]: mismatch }) =>
            mismatch === true
        ) !== undefined;
  }

  return {
    error,
    fulfilled,
    pending,
    data: {
      ...updatedData
    }
  };
};

const context = {
  useGetAppMessages
};

export { context as default, context, useGetAppMessages };
