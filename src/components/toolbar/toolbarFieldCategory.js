import React from 'react';
import PropTypes from 'prop-types';
import { useProduct, useProductGraphConfig, useProductToolbarQuery } from '../productView/productViewContext';
import { reduxTypes, storeHooks } from '../../redux';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { Select, SelectPosition } from '../form/select';
import { graphCardHelpers } from '../graphCard/graphCardHelpers';
import { translate } from '../i18n/i18n';

/**
 * A standalone Category select filter.
 *
 * @memberof Toolbar
 * @module ToolbarFieldCategory
 */

/**
 * Generate select field options from config
 *
 * @param {object} options
 * @param {Function} options.useProductGraphConfig
 * @returns {Function}
 */
const useToolbarFieldOptions = ({ useProductGraphConfig: useAliasProductGraphConfig = useProductGraphConfig } = {}) => {
  const { filters } = useAliasProductGraphConfig();
  const options = [];

  if (Array.isArray(filters)) {
    const updatedFilters = filters
      ?.map(({ metric, query }) => {
        const category = query?.[RHSM_API_QUERY_SET_TYPES.CATEGORY];

        if (category !== undefined) {
          return {
            title: translate('curiosity-toolbar.label', {
              context: ['category', (category === '' && 'none') || category]
            }),
            value: category,
            metaData: {
              metric,
              query
            },
            selected: false
          };
        }

        return undefined;
      })
      .filter(value => value !== undefined);

    if (updatedFilters?.length) {
      options.push(...updatedFilters);
    }
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
  const { productId, viewId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  return ({ value = null, selected = {} } = {}) => {
    let updatedGraphLegendValue = value;

    if (selected?.metaData?.metric) {
      updatedGraphLegendValue = graphCardHelpers.generateChartIds({
        metric: selected.metaData.metric,
        productId,
        query: { [RHSM_API_QUERY_SET_TYPES.CATEGORY]: value }
      });
    }

    dispatch([
      {
        type: reduxTypes.graph.SET_GRAPH_LEGEND,
        id: `${viewId}-inverted`,
        value: updatedGraphLegendValue
      },
      {
        type: reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST,
        viewId
      },
      {
        type: reduxTypes.query.SET_QUERY,
        viewId,
        filter: RHSM_API_QUERY_SET_TYPES.CATEGORY,
        value
      }
    ]);
  };
};

/**
 * Display a category field with generated options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {boolean} props.isFilter
 * @param {string} props.position
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useProductToolbarQuery
 * @param {Function} props.useToolbarFieldOptions
 * @returns {React.ReactNode}
 */
const ToolbarFieldCategory = ({
  isFilter,
  position,
  t,
  useOnSelect: useAliasOnSelect,
  useProductToolbarQuery: useAliasProductToolbarQuery,
  useToolbarFieldOptions: useAliasToolbarFieldOptions
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.CATEGORY]: updatedValue } = useAliasProductToolbarQuery();
  const onSelect = useAliasOnSelect();
  const options = useAliasToolbarFieldOptions();
  const updatedOptions = options.map(option => ({ ...option, selected: option.value === updatedValue }));

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'category'] })}
      onSelect={onSelect}
      options={updatedOptions}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: [isFilter && 'filter', 'category'] })}
      position={position}
      // variant={SelectVariant.checkbox}
      data-test="toolbarFieldCategory"
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, t: Function, useProductToolbarQuery: Function, isFilter: boolean,
 *     position: string, useToolbarFieldOptions: Function}}
 */
ToolbarFieldCategory.propTypes = {
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
ToolbarFieldCategory.defaultProps = {
  isFilter: false,
  position: SelectPosition.left,
  t: translate,
  useOnSelect,
  useProductToolbarQuery,
  useToolbarFieldOptions
};

export { ToolbarFieldCategory as default, ToolbarFieldCategory, useOnSelect, useToolbarFieldOptions };
