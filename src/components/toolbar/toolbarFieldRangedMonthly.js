import React from 'react';
import PropTypes from 'prop-types';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import { RHSM_API_QUERY_GRANULARITY_TYPES as FIELD_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { dateHelpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Select field options.
 *
 * @type {{title: (string|Node), value: string, selected: boolean}[]}
 */
const toolbarFieldOptions = dateHelpers.getRangedMonthDateTime().listDateTimeRanges.map(dateTime => ({
  ...dateTime,
  selected: false
}));

/**
 * On select update granularity.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnSelect = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { viewId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return ({ value } = {}) => {
    const { startDate, endDate } = value;
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.GRANULARITY],
        viewId,
        [RHSM_API_QUERY_TYPES.GRANULARITY]: FIELD_TYPES.DAILY
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.START_DATE],
        viewId,
        [RHSM_API_QUERY_TYPES.START_DATE]: startDate?.toISOString()
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.END_DATE],
        viewId,
        [RHSM_API_QUERY_TYPES.END_DATE]: endDate?.toISOString()
      }
    ]);
  };
};

/**
 * Display a granularity field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {boolean} props.isFilter
 * @param {Array} props.options
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {Node}
 */
const ToolbarFieldRangedMonthly = ({
  isFilter,
  options,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { [RHSM_API_QUERY_TYPES.START_DATE]: updatedValue } = useAliasProductGraphTallyQuery();
  const onSelect = useAliasOnSelect();

  const updatedOptions = options.map(option => ({
    ...option,
    selected: option.title === updatedValue || option.value.startDate.toISOString() === updatedValue
  }));

  return (
    <Select
      aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'rangedMonthly' })}
      onSelect={onSelect}
      options={updatedOptions}
      placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'rangedMonthly' })}
      position={position}
      maxHeight={250}
      data-test="toolbarFieldRangeGranularity"
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, useProductGraphTallyQuery: Function, t: Function, isFilter: boolean,
 *     options: Array, position: string}}
 */
ToolbarFieldRangedMonthly.propTypes = {
  isFilter: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  position: PropTypes.string,
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, useProductGraphTallyQuery: Function, t: Function, isFilter: boolean,
 *     options: Array, position: string}}
 */
ToolbarFieldRangedMonthly.defaultProps = {
  isFilter: false,
  options: toolbarFieldOptions,
  position: SelectPosition.left,
  t: translate,
  useOnSelect,
  useProductGraphTallyQuery
};

export { ToolbarFieldRangedMonthly as default, ToolbarFieldRangedMonthly, toolbarFieldOptions, useOnSelect };
