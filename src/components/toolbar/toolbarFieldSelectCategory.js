import React from 'react';
import PropTypes from 'prop-types';
import { FilterIcon } from '@patternfly/react-icons';
import { useShallowCompareEffect } from 'react-use';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductToolbarConfig } from '../productView/productViewContext';
import { Select } from '../form/select';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';
import { ToolbarFieldGranularity, toolbarFieldOptions as granularityOptions } from './toolbarFieldGranularity';
import { ToolbarFieldRangedMonthly, toolbarFieldOptions as rangedMonthlyOptions } from './toolbarFieldRangedMonthly';
import {
  ToolbarFieldBillingProvider,
  toolbarFieldOptions as billingProviderOptions
} from './toolbarFieldBillingProvider';
import { ToolbarFieldSla, toolbarFieldOptions as slaOptions } from './toolbarFieldSla';
import { ToolbarFieldUom, toolbarFieldOptions as uomOptions } from './toolbarFieldUom';
import { ToolbarFieldUsage, toolbarFieldOptions as usageOptions } from './toolbarFieldUsage';

/**
 * Select field options. Use function instead of arrow func to help with component
 * display name during testing.
 *
 * @type {{title: (string|Node), value: string, selected: boolean}[]}
 */
const toolbarFieldOptions = [
  {
    title: translate('curiosity-toolbar.category', { context: RHSM_API_QUERY_SET_TYPES.GRANULARITY }),
    value: RHSM_API_QUERY_SET_TYPES.GRANULARITY,
    component: function Granularity(props) {
      return <ToolbarFieldGranularity key="selectCategory_granularity" {...props} />;
    },
    options: granularityOptions,
    isClearable: false
  },
  {
    title: translate('curiosity-toolbar.category', { context: 'rangedMonthly' }),
    value: 'rangedMonthly',
    component: function RangedMonthly(props) {
      return <ToolbarFieldRangedMonthly key="selectCategory_rangedMonthly" {...props} />;
    },
    options: rangedMonthlyOptions,
    isClearable: false
  },
  {
    title: translate('curiosity-toolbar.category', { context: RHSM_API_QUERY_SET_TYPES.UOM }),
    value: RHSM_API_QUERY_SET_TYPES.UOM,
    component: function Uom(props) {
      return <ToolbarFieldUom key="selectCategory_uom" {...props} />;
    },
    options: uomOptions,
    isClearable: false
  },
  {
    title: translate('curiosity-toolbar.category', { context: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER }),
    value: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER,
    component: function BillingProvider(props) {
      return <ToolbarFieldBillingProvider key="selectCategory_billingProvider" {...props} />;
    },
    options: billingProviderOptions,
    isClearable: true
  },
  {
    title: translate('curiosity-toolbar.category', { context: RHSM_API_QUERY_SET_TYPES.SLA }),
    value: RHSM_API_QUERY_SET_TYPES.SLA,
    component: function Sla(props) {
      return <ToolbarFieldSla key="selectCategory_sla" {...props} />;
    },
    options: slaOptions,
    isClearable: true
  },
  {
    title: translate('curiosity-toolbar.category', { context: RHSM_API_QUERY_SET_TYPES.USAGE }),
    value: RHSM_API_QUERY_SET_TYPES.USAGE,
    component: function Usage(props) {
      return <ToolbarFieldUsage key="selectCategory_usage" {...props} />;
    },
    options: usageOptions,
    isClearable: true
  }
].map(option => ({
  ...option,
  selected: false
}));

/**
 * On select update category.
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
        type: reduxTypes.toolbar.SET_FILTER_TYPE,
        viewId,
        currentFilter: value
      }
    ]);
  };
};

/**
 * Return filtered category options, current, and initial value.
 *
 * @param {object} options
 * @param {Array} options.categoryOptions
 * @param {Function} options.useProduct
 * @param {Function} options.useProductToolbarConfig
 * @param {Function} options.useSelector
 * @returns {object}
 */
const useSelectCategoryOptions = ({
  categoryOptions = toolbarFieldOptions,
  useProduct: useAliasProduct = useProduct,
  useProductToolbarConfig: useAliasProductToolbarConfig = useProductToolbarConfig,
  useSelector: useAliasSelector = storeHooks.reactRedux.useSelector
} = {}) => {
  const { viewId } = useAliasProduct();
  const { currentFilter: updatedValue } = useAliasSelector(({ toolbar }) => toolbar.filters?.[viewId], {});
  const { filters = [] } = useAliasProductToolbarConfig();

  let initialValue;

  const updatedOptions = filters.map(({ id, selected }) => {
    const option = categoryOptions.find(({ value }) => id === value);

    if (updatedValue === undefined && selected) {
      initialValue = option.value;
    }

    return {
      ...option,
      selected: (updatedValue === undefined && selected) || updatedValue === option.value
    };
  });

  return {
    currentCategory: updatedValue,
    initialCategory: initialValue,
    options: updatedOptions
  };
};

/**
 * Display a granularity field with options.
 *
 * @fires onSelect
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useOnSelect
 * @param {Function} props.useSelectCategoryOptions
 * @returns {Node}
 */
const ToolbarFieldSelectCategory = ({
  t,
  useOnSelect: useAliasOnSelect,
  useSelectCategoryOptions: useAliasSelectCategoryOptions
}) => {
  const { currentCategory: updatedValue, initialCategory: initialValue, options } = useAliasSelectCategoryOptions();
  const onSelect = useAliasOnSelect();

  useShallowCompareEffect(() => {
    if (initialValue) {
      onSelect({ value: initialValue });
    }
  }, [initialValue, onSelect]);

  return (
    <Select
      aria-label={t('curiosity-toolbar.placeholder_filter')}
      onSelect={onSelect}
      options={options}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder_filter')}
      toggleIcon={<FilterIcon />}
      data-test="toolbarFieldCategory"
    />
  );
};

/**
 * Prop types.
 *
 * @type {{useOnSelect: Function, t: Function, useSelectCategoryOptions: Function}}
 */
ToolbarFieldSelectCategory.propTypes = {
  t: PropTypes.func,
  useOnSelect: PropTypes.func,
  useSelectCategoryOptions: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useOnSelect: Function, t: Function, useSelectCategoryOptions: Function}}
 */
ToolbarFieldSelectCategory.defaultProps = {
  t: translate,
  useOnSelect,
  useSelectCategoryOptions
};

export {
  ToolbarFieldSelectCategory as default,
  ToolbarFieldSelectCategory,
  toolbarFieldOptions,
  useOnSelect,
  useSelectCategoryOptions
};
