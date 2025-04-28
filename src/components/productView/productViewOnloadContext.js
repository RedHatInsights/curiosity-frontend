import { useEffect } from 'react';
import { useProductBillingAccountsQuery, useProductViewContext } from './productViewContext';
import { reduxActions, storeHooks } from '../../redux';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';

/**
 * Product view onload hooks. Hooks intended to fire AFTER product query and configuration is set.
 *
 * @memberof ProductViewOnload
 * @module ProductViewOnloadContext
 */

/**
 * Onload product apply conditional state dispatch services.
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
  useProductOnload
};

export { context as default, context, useProductOnload };
