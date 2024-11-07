import React from 'react';
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
 * Generate select field options from nested product graph configuration.
 *
 * @param {object} options
 * @param {useProductGraphConfig} [options.useProductGraphConfig=useProductGraphConfig]
 * @returns {Function}
 */
const useToolbarFieldOptions = ({ useProductGraphConfig: useAliasProductGraphConfig = useProductGraphConfig } = {}) => {
  const { filters } = useAliasProductGraphConfig();
  const options = [];

  if (Array.isArray(filters)) {
    const updatedFilters = [];
    const update = ({ metric, query }) => {
      const category = query?.[RHSM_API_QUERY_SET_TYPES.CATEGORY];
      const isDuplicate = updatedFilters.find(({ value }) => value === category);

      if (category !== undefined && !isDuplicate) {
        updatedFilters.push({
          title: translate('curiosity-toolbar.label', {
            context: ['category', (category === '' && 'none') || category]
          }),
          value: category,
          metaData: {
            metric,
            query
          },
          selected: false
        });
      }
    };

    filters?.forEach(({ filters: groupedFilters, ...restFilters }) => {
      if (Array.isArray(groupedFilters)) {
        groupedFilters.forEach(group => update(group));
      } else {
        update(restFilters);
      }
    });

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
 * @param {storeHooks.reactRedux.useDispatch} [options.useDispatch=storeHooks.reactRedux.useDispatch]
 * @param {useProduct} [options.useProduct=useProduct]
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
 * @param {object} props
 * @param {boolean} [props.isFilter=false]
 * @param {SelectPosition} [props.position=SelectPosition.left]
 * @param {translate} [props.t=translate]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @param {useProductToolbarQuery} [props.useProductToolbarQuery=useProductToolbarQuery]
 * @param {useToolbarFieldOptions} [props.useToolbarFieldOptions=useToolbarFieldOptions]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldCategory = ({
  isFilter = false,
  position = SelectPosition.left,
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useProductToolbarQuery: useAliasProductToolbarQuery = useProductToolbarQuery,
  useToolbarFieldOptions: useAliasToolbarFieldOptions = useToolbarFieldOptions
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

export { ToolbarFieldCategory as default, ToolbarFieldCategory, useOnSelect, useToolbarFieldOptions };
