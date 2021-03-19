import React from 'react';
import PropTypes from 'prop-types';
import { reduxTypes, store, useSelector } from '../../redux';
import { Select } from '../form/select';
import { RHSM_API_QUERY_GRANULARITY_TYPES as FIELD_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { dateHelpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * Select field options.
 *
 * @type {{title: (string|Node), value: string, selected: boolean}[]}
 */
const toolbarFieldOptions = Object.values(FIELD_TYPES).map(type => ({
  title: translate('curiosity-toolbar.granularity', { context: type }),
  value: type,
  selected: false
}));

/**
 * Display a granularity field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Array} props.options
 * @param {Function} props.t
 * @param {string} props.value
 * @param {string} props.viewId
 * @returns {Node}
 */
const ToolbarFieldGranularity = ({ options, t, value, viewId }) => {
  const updatedValue = useSelector(
    ({ view }) => view.graphTallyQuery?.[viewId]?.[RHSM_API_QUERY_TYPES.GRANULARITY],
    value
  );

  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  /**
   * On select, dispatch type.
   *
   * @event onSelect
   * @param {object} event
   * @returns {void}
   */
  const onSelect = event => {
    const { startDate, endDate } = dateHelpers.getRangedDateTime(event.value);
    store.dispatch([
      {
        type: reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.GRANULARITY],
        viewId,
        [RHSM_API_QUERY_TYPES.GRANULARITY]: event.value
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.START_DATE],
        viewId,
        [RHSM_API_QUERY_TYPES.START_DATE]: startDate.toISOString()
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.END_DATE],
        viewId,
        [RHSM_API_QUERY_TYPES.END_DATE]: endDate.toISOString()
      }
    ]);
  };

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: 'granularity' })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: 'granularity' })}
    />
  );
};

/**
 * Prop types.
 *
 * @type {{viewId: string, t: Function, options: Array, value: string}}
 */
ToolbarFieldGranularity.propTypes = {
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
ToolbarFieldGranularity.defaultProps = {
  options: toolbarFieldOptions,
  t: translate,
  value: FIELD_TYPES.DAILY,
  viewId: 'toolbarFieldGranularity'
};

export { ToolbarFieldGranularity as default, ToolbarFieldGranularity, toolbarFieldOptions };
