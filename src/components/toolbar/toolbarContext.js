import React from 'react';
import { useProductQuery, useProductGraphTallyQuery, useProductToolbarConfig } from '../productView/productViewContext';
import { RHSM_API_QUERY_SET_TYPES as RHSM_API_QUERY_TYPES } from '../../services/rhsm/rhsmConstants';
import { useOnSelect as useSelectCategoryOnSelect, toolbarFieldOptions } from './toolbarFieldSelectCategory';
import { useOnSelect as useBillingProviderOnSelect } from './toolbarFieldBillingProvider';
import { useOnSelect as useSlaOnSelect } from './toolbarFieldSla';
import { useOnSelect as useUsageOnSelect } from './toolbarFieldUsage';
import { SelectPosition } from '../form/select';

/**
 * Return current values for categories/queries.
 *
 * @param {object} options
 * @param {Function} options.useProductQuery
 * @param {Function} options.useProductGraphTallyQuery
 * @returns {object}
 */
const useToolbarFieldQueries = ({
  useProductQuery: useAliasProductQuery = useProductQuery,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
} = {}) => {
  const {
    [RHSM_API_QUERY_TYPES.BILLING_PROVIDER]: billingProvider,
    [RHSM_API_QUERY_TYPES.SLA]: sla,
    [RHSM_API_QUERY_TYPES.UOM]: uom,
    [RHSM_API_QUERY_TYPES.USAGE]: usage
  } = useAliasProductQuery();
  const { [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity } = useAliasProductGraphTallyQuery();

  return {
    [RHSM_API_QUERY_TYPES.BILLING_PROVIDER]: billingProvider,
    [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity,
    [RHSM_API_QUERY_TYPES.SLA]: sla,
    [RHSM_API_QUERY_TYPES.UOM]: uom,
    [RHSM_API_QUERY_TYPES.USAGE]: usage
  };
};

/**
 * Clear a specific toolbar category.
 *
 * @param {object} options
 * @param {Function} options.useBillingProviderOnSelect
 * @param {Function} options.useSlaOnSelect
 * @param {Function} options.useUsageOnSelect
 * @returns {Function}
 */
const useToolbarFieldClear = ({
  useBillingProviderOnSelect: useAliasBillingProviderOnSelect = useBillingProviderOnSelect,
  useSlaOnSelect: useAliasSlaOnSelect = useSlaOnSelect,
  useUsageOnSelect: useAliasUsageOnSelect = useUsageOnSelect
} = {}) => {
  const billingOnSelect = useAliasBillingProviderOnSelect();
  const slaOnSelect = useAliasSlaOnSelect();
  const usageOnSelect = useAliasUsageOnSelect();

  return field => {
    switch (field) {
      case RHSM_API_QUERY_TYPES.BILLING_PROVIDER:
        billingOnSelect();
        break;
      case RHSM_API_QUERY_TYPES.SLA:
        slaOnSelect();
        break;
      case RHSM_API_QUERY_TYPES.USAGE:
        usageOnSelect();
        break;
      default:
        break;
    }
  };
};

/**
 * Clear all available toolbar categories.
 *
 * @param {object} options
 * @param {Function} options.useProductQuery
 * @param {Function} options.useSelectCategoryOnSelect
 * @param {Function} options.useBillingProviderOnSelect
 * @param {Function} options.useSlaOnSelect
 * @param {Function} options.useUsageOnSelect
 * @returns {Function}
 */
const useToolbarFieldClearAll = ({
  useProductQuery: useAliasProductQuery = useProductQuery,
  useSelectCategoryOnSelect: useAliasSelectCategoryOnSelect = useSelectCategoryOnSelect,
  useBillingProviderOnSelect: useAliasBillingProviderOnSelect = useBillingProviderOnSelect,
  useSlaOnSelect: useAliasSlaOnSelect = useSlaOnSelect,
  useUsageOnSelect: useAliasUsageOnSelect = useUsageOnSelect
} = {}) => {
  const {
    [RHSM_API_QUERY_TYPES.BILLING_PROVIDER]: billingProvider,
    [RHSM_API_QUERY_TYPES.SLA]: sla,
    [RHSM_API_QUERY_TYPES.USAGE]: usage
  } = useAliasProductQuery();
  const billingOnSelect = useAliasBillingProviderOnSelect();
  const slaOnSelect = useAliasSlaOnSelect();
  const usageOnSelect = useAliasUsageOnSelect();
  const selectCategoryOnSelect = useAliasSelectCategoryOnSelect();

  return hardFilterReset => {
    if (typeof billingProvider === 'string') {
      billingOnSelect();
    }

    if (typeof sla === 'string') {
      slaOnSelect();
    }

    if (typeof usage === 'string') {
      usageOnSelect();
    }

    if (hardFilterReset) {
      selectCategoryOnSelect();
    }
  };
};

/**
 * Return list of secondary toolbar fields for display.
 *
 * @param {object} options
 * @param {Array} options.categoryOptions
 * @param {Function} options.useProductToolbarConfig
 * @returns {Array}
 */
const useToolbarSecondaryFields = ({
  categoryOptions = toolbarFieldOptions,
  useProductToolbarConfig: useAliasProductToolbarConfig = useProductToolbarConfig
} = {}) => {
  const { secondaryFilters = [] } = useAliasProductToolbarConfig();

  return secondaryFilters.map(({ id }) => {
    const { component: OptionComponent } = categoryOptions.find(
      ({ value: categoryOptionValue }) => id === categoryOptionValue
    );

    return <OptionComponent key={`option-${id}`} isFilter={false} position={SelectPosition.right} />;
  });
};

const context = {
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarFieldQueries,
  useToolbarSecondaryFields
};

export {
  context as default,
  context,
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarFieldQueries,
  useToolbarSecondaryFields
};
