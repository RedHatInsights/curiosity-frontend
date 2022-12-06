import { RHSM_API_QUERY_SET_TYPES } from './rhsmConstants';

/**
 * ToDo: remove filterArchitectureVariant when the API supports architecture, variant params
 */
/**
 * Patch for returning a made up API architecture, variant param as a product ID
 *
 * @param {string} id
 * @param {object} params
 * @returns {string}
 */
const filterArchitectureVariant = (id, params = {}) => {
  const updatedId = id;

  if (params?.[RHSM_API_QUERY_SET_TYPES.ARCHITECTURE]?.length) {
    return params?.[RHSM_API_QUERY_SET_TYPES.ARCHITECTURE];
  }

  if (params?.[RHSM_API_QUERY_SET_TYPES.VARIANT]?.length) {
    return params?.[RHSM_API_QUERY_SET_TYPES.VARIANT];
  }

  return updatedId;
};

const rhsmHelpers = {
  filterArchitectureVariant
};

export { rhsmHelpers as default, rhsmHelpers, filterArchitectureVariant };
