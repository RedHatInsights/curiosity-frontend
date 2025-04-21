import React, { useMemo } from 'react';
import { ToolbarItem } from '@patternfly/react-core';
import { useProductQuery, useProductToolbarConfig } from '../productView/productViewContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { useOnSelect as useSelectCategoryOnSelect, toolbarFieldOptions } from './toolbarFieldSelectCategory';
import { useOnSelect as useBillingProviderOnSelect } from './toolbarFieldBillingProvider';
import { useOnSelect as useBillingAccountOnSelect } from './toolbarFieldBillingAccount';
import { useOnSelect as useCategoryOnSelect } from './toolbarFieldCategory';
import { useOnSelect as useSlaOnSelect } from './toolbarFieldSla';
import { useOnSelect as useUsageOnSelect } from './toolbarFieldUsage';
import { helpers } from '../../common/helpers';

/**
 * @memberof Toolbar
 * @module ToolbarContext
 */

/**
 * Clear a specific toolbar category using a select component's OnSelect hook.
 *
 * @param {object} options
 * @param {useBillingAccountOnSelect} [options.useBillingAccountOnSelect=useBillingAccountOnSelect]
 * @param {useBillingProviderOnSelect} [options.useBillingProviderOnSelect=useBillingProviderOnSelect]
 * @param {useCategoryOnSelect} [options.useCategoryOnSelect=useCategoryOnSelect]
 * @param {useSlaOnSelect} [options.useSlaOnSelect=useSlaOnSelect]
 * @param {useUsageOnSelect} [options.useUsageOnSelect=useUsageOnSelect]
 * @returns {Function}
 */
const useToolbarFieldClear = ({
  useBillingAccountOnSelect: useAliasBillingAccountOnSelect = useBillingAccountOnSelect,
  useBillingProviderOnSelect: useAliasBillingProviderOnSelect = useBillingProviderOnSelect,
  useCategoryOnSelect: useAliasCategoryOnSelect = useCategoryOnSelect,
  useSlaOnSelect: useAliasSlaOnSelect = useSlaOnSelect,
  useUsageOnSelect: useAliasUsageOnSelect = useUsageOnSelect
} = {}) => {
  const billingProviderOnSelect = useAliasBillingProviderOnSelect();
  const billingAccountOnSelect = useAliasBillingAccountOnSelect();
  const categoryOnSelect = useAliasCategoryOnSelect();
  const slaOnSelect = useAliasSlaOnSelect();
  const usageOnSelect = useAliasUsageOnSelect();

  return field => {
    switch (field) {
      case RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID:
        billingAccountOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER:
        billingProviderOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.CATEGORY:
        categoryOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.SLA:
        slaOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.USAGE:
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
 * @param {useProductQuery} [options.useProductQuery=useProductQuery]
 * @param {useSelectCategoryOnSelect} [options.useSelectCategoryOnSelect=useSelectCategoryOnSelect]
 * @param {useBillingAccountOnSelect} [options.useBillingAccountOnSelect=useBillingAccountOnSelect]
 * @param {useBillingProviderOnSelect} [options.useBillingProviderOnSelect=useBillingProviderOnSelect]
 * @param {useCategoryOnSelect} [options.useCategoryOnSelect=useCategoryOnSelect]
 * @param {useSlaOnSelect} [options.useSlaOnSelect=useSlaOnSelect]
 * @param {useUsageOnSelect} [options.useUsageOnSelect=useUsageOnSelect]
 * @returns {Function}
 */
const useToolbarFieldClearAll = ({
  useProductQuery: useAliasProductQuery = useProductQuery,
  useSelectCategoryOnSelect: useAliasSelectCategoryOnSelect = useSelectCategoryOnSelect,
  useBillingAccountOnSelect: useAliasBillingAccountOnSelect = useBillingAccountOnSelect,
  useBillingProviderOnSelect: useAliasBillingProviderOnSelect = useBillingProviderOnSelect,
  useCategoryOnSelect: useAliasCategoryOnSelect = useCategoryOnSelect,
  useSlaOnSelect: useAliasSlaOnSelect = useSlaOnSelect,
  useUsageOnSelect: useAliasUsageOnSelect = useUsageOnSelect
} = {}) => {
  const {
    [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: billingProvider,
    [RHSM_API_QUERY_SET_TYPES.BILLING_ACCOUNT_ID]: billingAccount,
    [RHSM_API_QUERY_SET_TYPES.CATEGORY]: category,
    [RHSM_API_QUERY_SET_TYPES.SLA]: sla,
    [RHSM_API_QUERY_SET_TYPES.USAGE]: usage
  } = useAliasProductQuery();
  const billingProviderOnSelect = useAliasBillingProviderOnSelect();
  const billingAccountOnSelect = useAliasBillingAccountOnSelect();
  const categoryOnSelect = useAliasCategoryOnSelect();
  const slaOnSelect = useAliasSlaOnSelect();
  const usageOnSelect = useAliasUsageOnSelect();
  const selectCategoryOnSelect = useAliasSelectCategoryOnSelect();

  return hardFilterReset => {
    if (typeof billingAccount === 'string') {
      billingAccountOnSelect();
    }

    if (typeof billingProvider === 'string') {
      billingProviderOnSelect();
    }

    if (typeof category === 'string') {
      categoryOnSelect();
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
 * Return lists of item and secondary toolbar fields for display.
 *
 * @param {object} options
 * @param {Array<{value:string}>} [options.categoryOptions=toolbarFieldOptions]
 * @param {useProductToolbarConfig} [options.useProductToolbarConfig=useProductToolbarConfig]
 * @returns {Array}
 */
const useToolbarFields = ({
  categoryOptions = toolbarFieldOptions,
  useProductToolbarConfig: useAliasProductToolbarConfig = useProductToolbarConfig
} = {}) => {
  const { filters = [] } = useAliasProductToolbarConfig();

  return useMemo(() => {
    const setFilter = ({ id, content, ...filterProps }) => {
      const option = categoryOptions.find(({ value: categoryOptionValue }) => id === categoryOptionValue);
      const { component: OptionComponent } = option || {};

      return (
        (OptionComponent && (
          <ToolbarItem key={`option-${id}`}>
            <OptionComponent isFilter={false} {...filterProps} />
          </ToolbarItem>
        )) || (
          <ToolbarItem key={id || helpers.generateId()}>
            {typeof content === 'function' ? content() : content}
          </ToolbarItem>
        ) ||
        null
      );
    };

    return {
      itemFields: filters.filter(({ isItem }) => isItem === true).map(setFilter),
      secondaryFields: filters.filter(({ isSecondary }) => isSecondary === true).map(setFilter)
    };
  }, [categoryOptions, filters]);
};

const context = {
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarFields
};

export { context as default, context, useToolbarFieldClear, useToolbarFieldClearAll, useToolbarFields };
