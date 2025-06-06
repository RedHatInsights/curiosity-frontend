import React from 'react';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductQuery } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import { RHSM_API_QUERY_USAGE_TYPES as FIELD_TYPES, RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

/**
 * A standalone Usage select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldUsage
 */

/**
 * Select field options.
 *
 * @type {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.label', { context: ['usage', (type === '' && 'none') || type] }),
  value: type,
  isSelected: false
}));

/**
 * On select update usage.
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

  return ({ value = null } = {}) =>
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
        viewId: productId
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId: productId,
        filter: RHSM_API_QUERY_SET_TYPES.USAGE,
        value
      }
    ]);
};

/**
 * Display a usage field with options.
 *
 * @param {object} props
 * @param {boolean} [props.isFilter=false]
 * @param {boolean} [props.isInline=false]
 * @param {toolbarFieldOptions} [props.options=toolbarFieldOptions]
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {translate} [props.t=translate]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @param {useProductQuery} [props.useProductQuery=useProductQuery]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldUsage = ({
  isFilter = false,
  isInline = false,
  options = toolbarFieldOptions,
  position = SelectPosition.left,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProductQuery: useAliasProductQuery = useProductQuery
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.USAGE]: updatedValue } = useAliasProductQuery();
  const onSelect = useAliasOnSelect();

  const updatedOptions = options.map(option => ({ ...option, isSelected: option.value === updatedValue }));

  return (
    <Select
      isInline={isInline}
      aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'usage' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'usage' })}
      alignment={{ position }}
      data-test="toolbarFieldUsage"
    />
  );
};

export { ToolbarFieldUsage as default, ToolbarFieldUsage, toolbarFieldOptions, useOnSelect };
