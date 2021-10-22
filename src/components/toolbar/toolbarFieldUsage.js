import React from 'react';
import PropTypes from 'prop-types';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductQuery } from '../productView/productViewContext';
import { Select } from '../form/select';
import { RHSM_API_QUERY_USAGE_TYPES as FIELD_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * Select field options.
 *
 * @type {{title: (string|Node), value: string, selected: boolean}[]}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.usage', { context: (type === '' && 'unspecified') || type }),
  value: type,
  selected: false
}));

/**
 * Display a usage field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {object} props.options
 * @param {Function} props.t
 * @param {Function} props.useDispatch
 * @param {Function} props.useProduct
 * @param {Function} props.useProductQuery
 * @returns {Node}
 */
const ToolbarFieldUsage = ({
  options,
  t,
  useDispatch: useAliasDispatch,
  useProduct: useAliasProduct,
  useProductQuery: useAliasProductQuery
}) => {
  const { viewId } = useAliasProduct();
  const { [RHSM_API_QUERY_TYPES.USAGE]: updatedValue } = useAliasProductQuery();
  const dispatch = useAliasDispatch();

  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  /**
   * On select, dispatch type.
   *
   * @event onSelect
   * @param {object} event
   * @returns {void}
   */
  const onSelect = (event = {}) =>
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.USAGE],
        viewId,
        [RHSM_API_QUERY_TYPES.USAGE]: event.value
      }
    ]);

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: 'usage' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'usage' })}
      data-test="toolbarFieldUsage"
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useProduct: Function, useProductQuery: Function, t: translate, useDispatch: Function, options: Array}}
 */
ToolbarFieldUsage.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  t: PropTypes.func,
  useDispatch: PropTypes.func,
  useProduct: PropTypes.func,
  useProductQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProduct: Function, useProductQuery: Function, t: translate, useDispatch: Function, options: Array}}
 */
ToolbarFieldUsage.defaultProps = {
  options: toolbarFieldOptions,
  t: translate,
  useDispatch: storeHooks.reactRedux.useDispatch,
  useProduct,
  useProductQuery
};

export { ToolbarFieldUsage as default, ToolbarFieldUsage, toolbarFieldOptions };
