import React, { useMemo } from 'react';
import { ToolbarItem } from '@patternfly/react-core';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductQuery } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { ToolbarFieldBillingAccount } from './toolbarFieldBillingAccount';
import { translate } from '../i18n/i18n';

/**
 * A dynamic Billing Provider select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldBillingProvider
 */

/**
 * Generate select field options from config.
 *
 * @param {object} options
 * @param {translate} [options.t=translate]
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {useProductQuery} [options.useProductQuery=useProductQuery]
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
  const updatedBillingProvider = billingProvider || data?.defaultProvider;
  const billingProviders = data?.billingProviders;

  return useMemo(
    () =>
      billingProviders?.map(provider => ({
        title: t('curiosity-toolbar.label', {
          context: ['billing_provider', (provider === '' && 'none') || provider],
          value: provider
        }),
        value: provider,
        isSelected: provider === updatedBillingProvider
      })) || [],
    [billingProviders, updatedBillingProvider, t]
  );
};

/**
 * On select update billing provider.
 *
 * @param {object} options
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {storeHooks.reactRedux.useSelector} [options.useSelector=storeHooks.reactRedux.useSelector]
 * @returns {Function}
 */
const useOnSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { productId } = useAliasProduct();
  const { data = {} } = useAliasSelector(({ app }) => app.billingAccounts?.[productId], {});
  const defaultAccountByProvider = data?.defaultAccountByProvider || {};
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
        value: defaultAccountByProvider[value]
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId: productId,
        filter: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER,
        value
      }
    ]);
  };
};

/**
 * ToDo: review the isRead property on auto-populating the field
 */
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
const ToolbarFieldBillingProvider = ({
  isFilter = false,
  position = SelectPosition.left,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProductQuery: useAliasProductQuery = useProductQuery,
  useToolbarFieldOptions: useAliasToolbarFieldOptions = useToolbarFieldOptions
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: updatedValue } = useAliasProductQuery();
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();
  const updatedOptions = options.map(option => ({
    ...option,
    isSelected: updatedValue && option.value === updatedValue
  }));

  return (
    <React.Fragment>
      <ToolbarItem spacer={{ default: 'spacerNone' }}>
        <Select
          // isReadOnly={updatedOptions.length === 1}
          aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, {
            context: 'billing_provider'
          })}
          onSelect={onSelect}
          options={updatedOptions}
          selectedOptions={updatedValue}
          placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, {
            context: 'billing_provider'
          })}
          alignment={{ position }}
          data-test="toolbarFieldBillingProvider"
        />
      </ToolbarItem>
      <ToolbarItem>
        <ToolbarFieldBillingAccount />
      </ToolbarItem>
    </React.Fragment>
  );
};

export { ToolbarFieldBillingProvider as default, ToolbarFieldBillingProvider, useOnSelect, useToolbarFieldOptions };
