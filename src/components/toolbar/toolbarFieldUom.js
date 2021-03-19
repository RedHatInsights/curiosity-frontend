import React from 'react';
import PropTypes from 'prop-types';
import { reduxTypes, store, useSelector } from '../../redux';
import { Select } from '../form/select';
import { RHSM_API_QUERY_UOM_TYPES as FIELD_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { translate } from '../i18n/i18n';

/**
 * Select field options.
 *
 * @type {{title: (string|Node), value: string, selected: boolean}[]}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.uom', { context: type }),
  value: type,
  selected: false
}));

/**
 * Display a unit of measure (uom) field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Array} props.options
 * @param {Function} props.t
 * @param {string} props.value
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldUom = ({ options, t, value, viewId }) => {
  const updatedValue = useSelector(({ view }) => view.query?.[viewId]?.[RHSM_API_QUERY_TYPES.UOM], value);

  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  /**
   * On select, dispatch type.
   *
   * @event onSelect
   * @param {object} event
   * @returns {void}
   */
  const onSelect = event =>
    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.UOM],
        viewId,
        [RHSM_API_QUERY_TYPES.UOM]: event.value
      }
    ]);

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: 'uom' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'uom' })}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, options: Array, value: string}}
 */
ToolbarFieldUom.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      value: PropTypes.any,
      selected: PropTypes.bool
    })
  ),
  t: PropTypes.func,
  value: PropTypes.oneOf([...Object.values(FIELD_TYPES)]),
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{viewId: string, t: translate, options: Array, value: string}}
 */
ToolbarFieldUom.defaultProps = {
  options: toolbarFieldOptions,
  t: translate,
  value: FIELD_TYPES.CORES,
  viewId: 'toolbarFieldUom'
};

export { ToolbarFieldUom as default, ToolbarFieldUom, toolbarFieldOptions };
