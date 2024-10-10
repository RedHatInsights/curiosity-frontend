import React from 'react';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as FIELD_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { dateHelpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * A standalone Granularity select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldGranularity
 */

/**
 * Select field options.
 *
 * @type {Array<{title: React.ReactNode, value: string, selected: boolean}>}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.label', { context: ['granularity', type] }),
  value: type,
  selected: false
}));

/**
 * On select update granularity.
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
  const { viewId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return ({ value = null } = {}) => {
    const { startDate, endDate } = dateHelpers.getRangedDateTime(value);
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY_GRAPH,
        viewId,
        filter: RHSM_API_QUERY_SET_TYPES.GRANULARITY,
        value
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId,
        filter: RHSM_API_QUERY_SET_TYPES.START_DATE,
        value: startDate.toISOString()
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId,
        filter: RHSM_API_QUERY_SET_TYPES.END_DATE,
        value: endDate.toISOString()
      }
    ]);
  };
};

/**
 * Display a granularity field with options.
 *
 * @param {object} props
 * @param {boolean} [props.isFilter=false]
 * @param {toolbarFieldOptions} [props.options=toolbarFieldOptions]
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {translate} [props.t=translate]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @param {useProductGraphTallyQuery} [props.useProductGraphTallyQuery=useProductGraphTallyQuery]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldGranularity = ({
  isFilter = false,
  options = toolbarFieldOptions,
  position = SelectPosition.left,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: updatedValue } = useAliasProductGraphTallyQuery();
  const onSelect = useAliasOnSelect();
  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  return (
    <Select
      aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'granularity' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'granularity' })}
      position={position}
      data-test="toolbarFieldGranularity"
    />
  );
};

export { ToolbarFieldGranularity as default, ToolbarFieldGranularity, toolbarFieldOptions, useOnSelect };
