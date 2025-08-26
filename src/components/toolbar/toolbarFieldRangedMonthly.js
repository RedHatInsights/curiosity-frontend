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
 * A standalone Ranged Monthly Granularity select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldRangedMonthly
 */

/**
 * Select field options.
 *
 * @type {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const toolbarFieldOptions = dateHelpers.getRangedMonthDateTime().listDateTimeRanges.map(dateTime => ({
  ...dateTime,
  isSelected: false
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
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return ({ value } = {}) => {
    const { startDate, endDate } = value;
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST,
        viewId: productId
      },
      {
        type: reduxTypes.query.SET_QUERY_GRAPH,
        viewId: productId,
        filter: RHSM_API_QUERY_SET_TYPES.GRANULARITY,
        value: FIELD_TYPES.DAILY
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId: productId,
        filter: RHSM_API_QUERY_SET_TYPES.START_DATE,
        value: startDate.toISOString()
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId: productId,
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
 * @param {boolean} [props.isInline=false]
 * @param {toolbarFieldOptions} [props.options=toolbarFieldOptions]
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {translate} [props.t=translate]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @param {useProductGraphTallyQuery} [props.useProductGraphTallyQuery=useProductGraphTallyQuery]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldRangedMonthly = ({
  isFilter = false,
  isInline = false,
  options = toolbarFieldOptions,
  position = SelectPosition.left,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.START_DATE]: updatedValue } = useAliasProductGraphTallyQuery();
  const onSelect = useAliasOnSelect();

  return (
    <Select
      isInline={isInline}
      aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'rangedMonthly' })}
      onSelect={onSelect}
      options={options}
      selectedOptions={updatedValue}
      placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'rangedMonthly' })}
      maxHeight={250}
      alignment={{ position }}
      data-test="toolbarFieldRangeGranularity"
    />
  );
};

export { ToolbarFieldRangedMonthly as default, ToolbarFieldRangedMonthly, toolbarFieldOptions, useOnSelect };
