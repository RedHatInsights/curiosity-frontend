import React from 'react';
import PropTypes from 'prop-types';
import { useProduct, useProductToolbarQuery } from '../productView/productViewContext';
import { reduxTypes, storeHooks } from '../../redux';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { Select, SelectPosition } from '../form/select';
import { translate } from '../i18n/i18n';

/**
 * Generate select field options from config
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useToolbarFieldOptions = ({ useProduct: useAliasProduct = useProduct } = {}) => {
  const { productArchitectures } = useAliasProduct();
  const options = [];

  if (Array.isArray(productArchitectures)) {
    options.push(
      ...productArchitectures.map(type => ({
        title: translate('curiosity-toolbar.label', {
          context: ['architecture', (type === '' && 'unspecified') || type]
        }),
        value: type,
        selected: false
      }))
    );
  }

  return options;
};

/**
 * On select update.
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
        type: reduxTypes.query.SET_QUERY,
        viewId,
        filter: RHSM_API_QUERY_SET_TYPES.ARCHITECTURE,
        value
      }
    ]);
  };
};

/**
 * Display an architecture field with generated options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {boolean} props.isFilter
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useProductToolbarQuery
 * @param {Function} props.useToolbarFieldOptions
 * @returns {Node}
 */
const ToolbarFieldArchitecture = ({
  isFilter,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useProductToolbarQuery: useAliasProductToolbarQuery,
  useToolbarFieldOptions: useAliasToolbarFieldOptions
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.ARCHITECTURE]: updatedValue } = useAliasProductToolbarQuery();
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();
  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'architecture'] })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'architecture'] })}
      position={position}
      data-test="toolbarFieldArchitecture"
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, t: Function, useProductToolbarQuery: Function, isFilter: boolean,
 *     position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldArchitecture.propTypes = {
  isFilter: PropTypes.bool,
  position: PropTypes.string,
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useProductToolbarQuery: PropTypes.func,
  useToolbarFieldOptions: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: translate, useProductToolbarQuery: Function, isFilter: boolean,
 *     position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldArchitecture.defaultProps = {
  isFilter: false,
  position: SelectPosition.left,
  t: translate,
  useOnSelect,
  useProductToolbarQuery,
  useToolbarFieldOptions
};

export { ToolbarFieldArchitecture as default, ToolbarFieldArchitecture, useOnSelect, useToolbarFieldOptions };
