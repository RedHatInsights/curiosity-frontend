import React, { useEffect, useMemo } from 'react';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductQuery } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

/**
 * A dynamic Billing Account select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldBillingAccount
 */

/**
 * ToDo: review activating the default account to help in auto-population.
 */
/**
 * Generate select field options from service.
 * Note: Avoid using the translation wrapper for "account" for scenarios where the account
 * contains underscores. Underscores interfere with the contextual string lookup.
 *
 * @param {object} options
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {useProductQuery} [options.useProductQuery=useProductQuery]
 * @param {storeHooks.reactRedux.useSelector} [options.useSelector=storeHooks.reactRedux.useSelector]
 * @returns {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const useToolbarFieldOptions = ({
  useProduct: useAliasProduct = useProduct,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: billingProvider } = useAliasProductQuery();
  const { productId } = useAliasProduct();
  const { data = {} } = useAliasSelector(({ app }) => app.billingAccounts?.[productId], {});
  // const updatedBillingProvider = billingProvider || data?.defaultProvider;
  const updatedBillingProvider = billingProvider;
  const defaultAccount = data?.defaultAccountByProvider?.[updatedBillingProvider];
  const billingAccounts = data?.accountsByProvider?.[updatedBillingProvider];

  return useMemo(
    () =>
      billingAccounts?.map(account => ({
        title: account,
        value: account,
        isSelected: account === defaultAccount
      })) || [],
    [billingAccounts, defaultAccount]
  );
};

/**
 * On select update billing account.
 *
 * @param {object} options
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProduct} [options.useProduct=useProduct]
 * @returns {Function}
 */
const useOnSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return ({ value = null } = {}) => {
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
        viewId: productId
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId: productId,
        filter: RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID,
        value
      }
    ]);
  };
};

/**
 * Display a billing provider field with options.
 *
 * @param {object} props
 * @param {boolean} [props.isFilter=false]
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {translate} [props.t=translate]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @param {useProductQuery} [props.useProductQuery=useProductQuery]
 * @param {useToolbarFieldOptions} [props.useToolbarFieldOptions=useToolbarFieldOptions]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldBillingAccount = ({
  isFilter = false,
  position = SelectPosition.left,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useToolbarFieldOptions: useAliasToolbarFieldOptions = useToolbarFieldOptions
}) => {
  const {
    [RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID]: updatedValue,
    [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: billingProvider
  } = useAliasProductQuery();
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();
  const updatedOptions = options.map(option => ({
    ...option,
    isSelected: option.value === updatedValue
  }));

  // Select an account on provider update
  useEffect(() => {
    const selectedAccount = updatedOptions.find(({ isSelected }) => isSelected === true)?.value;

    if (selectedAccount) {
      onSelect({ value: selectedAccount });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingProvider]);

  return (
    <Select
      isReadOnly={updatedOptions.length === 1}
      aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'billing_account' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'billing_account' })}
      alignment={{ position }}
      data-test="toolbarFieldBillingAccount"
    />
  );
};

export { ToolbarFieldBillingAccount as default, ToolbarFieldBillingAccount, useOnSelect, useToolbarFieldOptions };
