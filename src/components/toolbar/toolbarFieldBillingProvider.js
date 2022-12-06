import React from 'react';
import PropTypes from 'prop-types';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductQuery } from '../productView/productViewContext';
import { Select, SelectPosition } from '../form/select';
import {
  RHSM_API_QUERY_BILLING_PROVIDER_TYPES as FIELD_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

/**
 * Select field options.
 *
 * @type {{title: (string|Node), value: string, selected: boolean}[]}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.label', { context: ['billing_provider', (type === '' && 'none') || type] }),
  value: type,
  selected: false
}));

/**
 * On select update billing provider.
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

  return ({ value = null } = {}) => {
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER],
        viewId,
        [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: value
      }
    ]);
  };
};

/**
 * Display a billing provider field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {boolean} props.isFilter
 * @param {object} props.options
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useProductQuery
 * @returns {Node}
 */
const ToolbarFieldBillingProvider = ({
  isFilter,
  options,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useProductQuery: useAliasProductQuery
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: updatedValue } = useAliasProductQuery();
  const onSelect = useAliasOnSelect();

  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  return (
    <Select
      aria-label={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'billing_provider' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t(`curiosity-toolbar.placeholder${(isFilter && '_filter') || ''}`, { context: 'billing_provider' })}
      position={position}
      data-test="toolbarFieldBillingProvider"
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, t: Function, isFilter: boolean, options: Array, useProductQuery: Function,
 *     position: string}}
 */
ToolbarFieldBillingProvider.propTypes = {
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
  useProductQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: Function, isFilter: boolean, options: Array, useProductQuery: Function,
 *     position: string}}
 */
ToolbarFieldBillingProvider.defaultProps = {
  isFilter: false,
  options: toolbarFieldOptions,
  position: SelectPosition.left,
  t: translate,
  useOnSelect,
  useProductQuery
};

export { ToolbarFieldBillingProvider as default, ToolbarFieldBillingProvider, toolbarFieldOptions, useOnSelect };
