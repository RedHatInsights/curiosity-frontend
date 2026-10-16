import {
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_QUERY_SLA_TYPES,
  RHSM_API_QUERY_USAGE_TYPES
} from '../../services/rhsm/rhsmConstants';

const hasValidValue = (value, validValues) => value !== '' && Object.values(validValues).includes(value);

const isFilterAvailable = (availableFilters, filter) =>
  !Array.isArray(availableFilters) || availableFilters.some(({ id } = {}) => id === filter);

/**
 * Apply the Curiosity SLA and Usage defaults.
 *
 * @param {object} query
 * @param {Array<{id: string}>} [availableFilters] Toolbar filters supported by the current product config.
 * @returns {object}
 */
const normalizeSlaUsageQuery = (query = {}, availableFilters) => {
  const slaFilter = RHSM_API_QUERY_SET_TYPES.SLA;
  const usageFilter = RHSM_API_QUERY_SET_TYPES.USAGE;
  const safeQuery = query || {};
  const normalizedQuery = { ...safeQuery };

  if (isFilterAvailable(availableFilters, slaFilter)) {
    normalizedQuery[slaFilter] = hasValidValue(safeQuery[slaFilter], RHSM_API_QUERY_SLA_TYPES)
      ? safeQuery[slaFilter]
      : RHSM_API_QUERY_SLA_TYPES.PREMIUM;
  } else {
    delete normalizedQuery[slaFilter];
  }

  if (isFilterAvailable(availableFilters, usageFilter)) {
    normalizedQuery[usageFilter] = hasValidValue(safeQuery[usageFilter], RHSM_API_QUERY_USAGE_TYPES)
      ? safeQuery[usageFilter]
      : RHSM_API_QUERY_USAGE_TYPES.PRODUCTION;
  } else {
    delete normalizedQuery[usageFilter];
  }

  return normalizedQuery;
};

export { normalizeSlaUsageQuery as default, normalizeSlaUsageQuery };
