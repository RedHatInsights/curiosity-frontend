import { PLATFORM_API_EXPORT_STATUS_TYPES } from './platformConstants';
import { helpers } from '../../common';

/**
 * @memberof Platform
 * @module PlatformHelpers
 */

/**
 * Normalize a product id pulled from an export name. Fallback filtering for product identifiers.
 *
 * @param {string} str
 * @returns {undefined|string}
 */
const getExportProductId = str => {
  const updatedStr = str;
  const attemptId = updatedStr?.replace(`${helpers.CONFIG_EXPORT_SERVICE_NAME_PREFIX}-`, '')?.trim();

  if (attemptId === updatedStr) {
    return undefined;
  }

  return attemptId;
};

/**
 * Normalize an export status to be either `pending`, `complete`, or `failed`.
 *
 * @param {PLATFORM_API_EXPORT_STATUS_TYPES} str
 * @returns {string}
 */
const getExportStatus = str => {
  let updatedStatus;

  switch (str) {
    case PLATFORM_API_EXPORT_STATUS_TYPES.PARTIAL:
    case PLATFORM_API_EXPORT_STATUS_TYPES.FAILED:
      updatedStatus = PLATFORM_API_EXPORT_STATUS_TYPES.FAILED;
      break;
    case PLATFORM_API_EXPORT_STATUS_TYPES.COMPLETE:
      updatedStatus = PLATFORM_API_EXPORT_STATUS_TYPES.COMPLETE;
      break;
    case PLATFORM_API_EXPORT_STATUS_TYPES.RUNNING:
    default:
      updatedStatus = PLATFORM_API_EXPORT_STATUS_TYPES.PENDING;
  }

  return updatedStatus;
};

const platformHelpers = {
  getExportProductId,
  getExportStatus
};

export { platformHelpers as default, platformHelpers, getExportProductId, getExportStatus };
