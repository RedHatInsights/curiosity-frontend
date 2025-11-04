import React from 'react';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductQuery } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import { RHSM_API_QUERY_SLA_TYPES as FIELD_TYPES, RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

/**
 * A standalone SLA select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldSla
 */

/**
 * Select field options.
 *
 * @type {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.label', { context: ['sla', (type === '' && 'none') || type] }),
  value: type,
  isSelected: false
}));

/**
 * On select update sla.
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
        filter: RHSM_API_QUERY_SET_TYPES.SLA,
        value
      }
    ]);
  };
};

/**
 * Display a sla field with options.
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
const ToolbarFieldSla = ({
  isFilter = false,
  isInline = false,
  options = toolbarFieldOptions,
  position = SelectPosition.left,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProductQuery: useAliasProductQuery = useProductQuery
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.SLA]: updatedValue } = useAliasProductQuery();
  const onSelect = useAliasOnSelect();

  return (
    <Select
      isInline={isInline}
      aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'sla' })}
      onSelect={onSelect}
      options={options}
      selectedOptions={updatedValue}
      placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'sla' })}
      alignment={{ position }}
      data-test="toolbarFieldSla"
    />
  );
};

export { ToolbarFieldSla as default, ToolbarFieldSla, toolbarFieldOptions, useOnSelect };
