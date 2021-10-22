import { useProductQuery, useProductGraphTallyQuery } from '../productView/productViewContext';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { useOnSelect as useSelectCategoryOnSelect } from './toolbarFieldSelectCategory';
import { useOnSelect as useSlaOnSelect } from './toolbarFieldSla';
import { useOnSelect as useUsageOnSelect } from './toolbarFieldUsage';

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
    [RHSM_API_QUERY_TYPES.SLA]: sla,
    [RHSM_API_QUERY_TYPES.UOM]: uom,
    [RHSM_API_QUERY_TYPES.USAGE]: usage
  } = useAliasProductQuery();
  const { [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity } = useAliasProductGraphTallyQuery();

  return {
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
 * @param {Function} options.useSlaOnSelect
 * @param {Function} options.useUsageOnSelect
 * @returns {Function}
 */
const useToolbarFieldClear = ({
  useSlaOnSelect: useAliasSlaOnSelect = useSlaOnSelect,
  useUsageOnSelect: useAliasUsageOnSelect = useUsageOnSelect
} = {}) => {
  const slaOnSelect = useAliasSlaOnSelect();
  const usageOnSelect = useAliasUsageOnSelect();

  return field => {
    switch (field) {
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
 * @param {Function} options.useSlaOnSelect
 * @param {Function} options.useUsageOnSelect
 * @returns {Function}
 */
const useToolbarFieldClearAll = ({
  useProductQuery: useAliasProductQuery = useProductQuery,
  useSelectCategoryOnSelect: useAliasSelectCategoryOnSelect = useSelectCategoryOnSelect,
  useSlaOnSelect: useAliasSlaOnSelect = useSlaOnSelect,
  useUsageOnSelect: useAliasUsageOnSelect = useUsageOnSelect
} = {}) => {
  const { [RHSM_API_QUERY_TYPES.SLA]: sla, [RHSM_API_QUERY_TYPES.USAGE]: usage } = useAliasProductQuery();
  const slaOnSelect = useAliasSlaOnSelect();
  const usageOnSelect = useAliasUsageOnSelect();
  const selectCategoryOnSelect = useAliasSelectCategoryOnSelect();

  return hardFilterReset => {
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

const context = {
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarFieldQueries
};

export { context as default, context, useToolbarFieldClear, useToolbarFieldClearAll, useToolbarFieldQueries };
