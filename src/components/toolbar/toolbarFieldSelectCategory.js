import React from 'react';
import { FilterIcon } from '@patternfly/react-icons';
import { useShallowCompareEffect } from 'react-use';
import { reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductToolbarConfig } from '../productView/productViewContext';
import { Select } from '../form/select';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';
import {
  ToolbarFieldBillingProvider,
  toolbarFieldOptions as billingProviderOptions
} from './toolbarFieldBillingProvider';
import { ToolbarFieldCategory } from './toolbarFieldCategory';
import { ToolbarFieldDisplayName } from './toolbarFieldDisplayName';
import { ToolbarFieldExport } from './toolbarFieldExport';
import { ToolbarFieldGranularity, toolbarFieldOptions as granularityOptions } from './toolbarFieldGranularity';
import { ToolbarFieldRangedMonthly, toolbarFieldOptions as rangedMonthlyOptions } from './toolbarFieldRangedMonthly';
import { ToolbarFieldSla, toolbarFieldOptions as slaOptions } from './toolbarFieldSla';
import { ToolbarFieldUsage, toolbarFieldOptions as usageOptions } from './toolbarFieldUsage';

/**
 * @memberof Toolbar
 * @module ToolbarFieldSelectCategory
 */

/**
 * Select field options. Use function instead of arrow func to help with component
 * display name during testing.
 *
 * @type {Array<{title: React.ReactNode, value: string, isSelected: boolean}>}
 */
const toolbarFieldOptions = [
  {
    title: translate('curiosity-toolbar.label', { context: ['filter', RHSM_API_QUERY_SET_TYPES.GRANULARITY] }),
    value: RHSM_API_QUERY_SET_TYPES.GRANULARITY,
    component: function Granularity(props) {
      return <ToolbarFieldGranularity key="selectCategory_granularity" {...props} />;
    },
    options: granularityOptions,
    isClearable: false
  },
  {
    title: translate('curiosity-toolbar.label', { context: ['filter', 'rangedMonthly'] }),
    value: 'rangedMonthly',
    component: function RangedMonthly(props) {
      return <ToolbarFieldRangedMonthly key="selectCategory_rangedMonthly" {...props} />;
    },
    options: rangedMonthlyOptions,
    isClearable: false
  },
  {
    title: translate('curiosity-toolbar.label', { context: ['filter', RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER] }),
    value: RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER,
    component: function BillingProvider(props) {
      return <ToolbarFieldBillingProvider key="selectCategory_billingProvider" {...props} />;
    },
    options: billingProviderOptions,
    isClearable: true
  },
  {
    title: translate('curiosity-toolbar.label', { context: ['filter', RHSM_API_QUERY_SET_TYPES.SLA] }),
    value: RHSM_API_QUERY_SET_TYPES.SLA,
    component: function Sla(props) {
      return <ToolbarFieldSla key="selectCategory_sla" {...props} />;
    },
    options: slaOptions,
    isClearable: true
  },
  {
    title: translate('curiosity-toolbar.label', { context: ['filter', RHSM_API_QUERY_SET_TYPES.USAGE] }),
    value: RHSM_API_QUERY_SET_TYPES.USAGE,
    component: function Usage(props) {
      return <ToolbarFieldUsage key="selectCategory_usage" {...props} />;
    },
    options: usageOptions,
    isClearable: true
  },
  {
    title: translate('curiosity-toolbar.label', { context: ['filter', RHSM_API_QUERY_SET_TYPES.CATEGORY] }),
    value: RHSM_API_QUERY_SET_TYPES.CATEGORY,
    component: function Variant(props) {
      return <ToolbarFieldCategory key="selectCategory_category" {...props} />;
    },
    options: [],
    isClearable: true
  },
  {
    title: translate('curiosity-toolbar.label', { context: ['filter', RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME] }),
    value: RHSM_API_QUERY_SET_TYPES.DISPLAY_NAME,
    component: function DisplayName(props) {
      return <ToolbarFieldDisplayName key="selectCategory_variant" {...props} />;
    },
    options: null,
    isClearable: true
  },
  {
    title: translate('curiosity-toolbar.label', { context: ['filter', 'export'] }),
    value: 'export',
    component: function Export(props) {
      return <ToolbarFieldExport key="selectCategory_export" {...props} />;
    },
    options: [],
    isClearable: false
  }
].map(option => ({
  ...option,
  isSelected: false
}));

/**
 * On select update category.
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
 * @param {toolbarFieldOptions} [options.categoryOptions=toolbarFieldOptions]
 * @param {useProduct} [options.useProduct=useProduct]
 * @param {useProductToolbarConfig} [options.useProductToolbarConfig=useProductToolbarConfig]
 * @param {storeHooks.reactRedux.useSelector} [options.useSelector=storeHooks.reactRedux.useSelector]
 * @returns {{currentCategory: unknown, initialCategory: string, options: Array<{title: React.ReactNode,
 *     value: string, isSelected: boolean}>}}
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

  const updatedOptions = filters
    .filter(({ isItem, isSecondary }) => !isItem && !isSecondary)
    .map(({ id, isSelected }) => {
      const option = categoryOptions.find(({ value }) => id === value);

      if (updatedValue === undefined && isSelected) {
        initialValue = option.value;
      }

      return {
        ...option,
        isSelected: (updatedValue === undefined && isSelected) || updatedValue === option.value
      };
    });

  return {
    currentCategory: updatedValue,
    initialCategory: initialValue,
    options: updatedOptions
  };
};

/**
 * Display a select category field with options.
 *
 * @param {object} props
 * @param {translate} [props.t=translate]
 * @param {useOnSelect} [props.useOnSelect=useOnSelect]
 * @param {useSelectCategoryOptions} [props.useSelectCategoryOptions=useSelectCategoryOptions]
 * @fires onSelect
 * @returns {JSX.Element}
 */
const ToolbarFieldSelectCategory = ({
  t = translate,
  useOnSelect: useAliasOnSelect = useOnSelect,
  useSelectCategoryOptions: useAliasSelectCategoryOptions = useSelectCategoryOptions
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
      aria-label={t('curiosity-toolbar.placeholder', { context: ['filter'] })}
      onSelect={onSelect}
      options={options}
      selectedOptions={updatedValue}
      placeholder={t('curiosity-toolbar.placeholder', { context: ['filter'] })}
      toggle={{ icon: <FilterIcon /> }}
      data-test="toolbarFieldSelectCategory"
    />
  );
};

export {
  ToolbarFieldSelectCategory as default,
  ToolbarFieldSelectCategory,
  toolbarFieldOptions,
  useOnSelect,
  useSelectCategoryOptions
};
