import React, { useEffect, useMemo } from 'react';
import { useMount } from 'react-use';
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
 * Generate select field options from config.
 *
 * @param {object} options
 * @param {translate} [options.t=translate]
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {storeHooks.reactRedux.useSelector} [options.useSelector=storeHooks.reactRedux.useSelector]
 * @returns {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const useToolbarFieldOptions = ({
  t = translate,
  useProduct: useAliasProduct = useProduct,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: billingProvider } = useAliasProductQuery();
  const { productId } = useAliasProduct();
  const { data = {} } = useAliasSelector(({ app }) => app.billingAccounts?.[productId], {});
  // const defaultAccount = data?.defaultAccount;
  const defaultProvider = data?.defaultProvider;
  const billingAccounts = data?.accountsByProvider?.[billingProvider || defaultProvider];

  console.log('>>> billing account options', billingAccounts);

  return useMemo(
    () =>
      billingAccounts?.map((account, index) => ({
        title: t('curiosity-toolbar.label', { context: ['billing_account_id', account] }),
        value: account,
        isSelected: index === 0
      })) || [],
    [billingAccounts, t]
  );
};

/**
 * On select update billing provider.
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
    [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: provider
  } = useAliasProductQuery();
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();
  /*
   *const updatedOptions = options.map(option => ({
   *  ...option,
   *  // isSelected: (updatedValue && option.value === updatedValue) || option.isSelected
   *  // isSelected: updatedValue && option.value === updatedValue
   *  isSelected: option.value === updatedValue
   *}));
   */

  const updatedOptions = options.map(option => ({
    ...option,
    isSelected: option.value === updatedValue
    // isSelected: (updatedValue && option.value === updatedValue) || (!updatedValue && option.isSelected) || false
    /*
     * isSelected: updatedValue && option.value === updatedValue
     * isSelected: option.value === updatedValue
     */
  }));

  // console.log('>>>>> BILLING ACCOUNT', updatedValue, updatedOptions);

  useEffect(() => {
    console.log('>>>> BILLING PROVIDER', provider);
    const defaultAccount = updatedOptions.find(({ isSelected }) => isSelected === true)?.value;

    if (defaultAccount) {
      onSelect({ value: defaultAccount });
    }
  }, [provider]);

  return (
    <Select
      isDisabled={options.length <= 1}
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
