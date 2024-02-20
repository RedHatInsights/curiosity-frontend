import { rbacConfig } from '../../config';
import {
  platformConstants,
  PLATFORM_API_EXPORT_STATUS_TYPES,
  PLATFORM_API_EXPORT_FILENAME_PREFIX as EXPORT_PREFIX,
  PLATFORM_API_RESPONSE_USER_PERMISSION_OPERATION_TYPES as OPERATION_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_RESOURCE_TYPES as RESOURCE_TYPES
} from './platformConstants';
import { helpers } from '../../common';

/**
 * Transform export responses. Combines multiple exports, or a single export,
 * into the same response format.
 *
 * @memberof Platform
 * @module PlatformTransformers
 */

/**
 * Parse platform export response.
 *
 * @param {object} response
 * @returns {object}
 */
const exports = response => {
  const updatedResponse = { data: {}, meta: {} };
  const {
    [platformConstants.PLATFORM_API_EXPORT_RESPONSE_DATA]: data,
    [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.FORMAT]: format,
    [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.ID]: id,
    [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.NAME]: name,
    [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.STATUS]: status
  } = response || {};

  /**
   * Pull a product id from an export name. Fallback filtering for product identifiers.
   *
   * @param {string} str
   * @returns {undefined|string}
   */
  const getProductId = str => {
    const updatedStr = str;
    const attemptId = updatedStr?.replace(`${EXPORT_PREFIX}-`, '')?.trim();

    if (attemptId === updatedStr) {
      return undefined;
    }

    return attemptId;
  };

  /**
   * Get a refined export status
   *
   * @param {string} str
   * @returns {string}
   */
  const getStatus = str => {
    const updatedStr = str;
    let updatedStatus = PLATFORM_API_EXPORT_STATUS_TYPES.PENDING;

    if (
      updatedStr === PLATFORM_API_EXPORT_STATUS_TYPES.FAILED ||
      updatedStr === PLATFORM_API_EXPORT_STATUS_TYPES.COMPLETED
    ) {
      updatedStatus = updatedStr;
    }

    return updatedStatus;
  };

  /**
   * Restructures export response to allow for product identifiers.
   *
   * @param {object} params
   * @param {string} params.exportName
   * @param {string} params.exportStatus
   * @param {string} params.exportFormat
   * @param {string} params.exportId
   */
  const restructureResponse = ({ exportName, exportStatus, exportFormat, exportId } = {}) => {
    const productId = getProductId(exportName);
    const focusedStatus = getStatus(exportStatus);

    if (updatedResponse.data.isAnythingPending !== true) {
      updatedResponse.data.isAnythingPending = focusedStatus === PLATFORM_API_EXPORT_STATUS_TYPES.PENDING;
    }

    updatedResponse.data[productId] ??= [];
    updatedResponse.data[productId].push({
      format: exportFormat,
      id: exportId,
      name: exportName,
      status: focusedStatus
    });
  };

  if (Array.isArray(data)) {
    data
      .filter(({ [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.NAME]: exportName }) =>
        new RegExp(`^${EXPORT_PREFIX}`, 'i').test(exportName)
      )
      .forEach(
        ({
          [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.FORMAT]: exportFormat,
          [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.ID]: exportId,
          [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.NAME]: exportName,
          [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.STATUS]: exportStatus
        }) => {
          restructureResponse({ exportName, exportStatus, exportFormat, exportId });
        }
      );
  } else if (id && status && new RegExp(`^${EXPORT_PREFIX}`, 'i').test(name)) {
    restructureResponse({ exportName: name, exportStatus: status, exportFormat: format, exportId: id });
  }

  return updatedResponse;
};

/**
 * Parse platform getUser response.
 *
 * @param {object} response
 * @returns {object}
 */
const user = response => {
  const updatedResponse = {};
  const {
    [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY]: identity = {},
    [platformConstants.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS]: entitlements = {}
  } = response || {};

  updatedResponse.isAdmin =
    identity?.[platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER]?.[
      platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN
    ] || false;

  updatedResponse.isEntitled =
    entitlements?.[helpers.UI_NAME]?.[platformConstants.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES.ENTITLED] ||
    false;

  return updatedResponse;
};

/**
 * Parse platform getUserPermissions response.
 *
 * @param {object} response
 * @param {object} options
 * @param {object} options.config Pass in a configuration object, RBAC
 * @returns {object}
 */
const userPermissions = (response, { config = rbacConfig } = {}) => {
  const updatedResponse = {
    permissions: {},
    authorized: {}
  };

  response?.forEach(
    ({
      [platformConstants.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION]: permission,
      [platformConstants.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.RESOURCE_DEFS]: definitions = []
    }) => {
      const [app = '', resource, operation] = permission?.split(':') || [];

      if (!updatedResponse.permissions[app]) {
        updatedResponse.permissions[app] = {
          all: false,
          resources: {}
        };
      }

      if (resource === RESOURCE_TYPES.ALL && operation === OPERATION_TYPES.ALL) {
        updatedResponse.permissions[app].all = true;
      }

      if (resource) {
        updatedResponse.permissions[app].resources[resource] ??= {};

        if (operation) {
          updatedResponse.permissions[app].resources[resource][operation] = definitions;
        }
      }
    }
  );

  // Alias specific app permissions checks
  Object.entries(config).forEach(([key, { permissions: resourcePermissions }]) => {
    updatedResponse.authorized[key] = updatedResponse.permissions[key]?.all || false;

    resourcePermissions.forEach(({ resource: res, operation: op }) => {
      if (updatedResponse.permissions[key]?.resources?.[res]?.[op]) {
        updatedResponse.authorized[key] = true;
      }
    });
  });

  return updatedResponse;
};

const platformTransformers = {
  exports,
  user,
  permissions: userPermissions
};

export { platformTransformers as default, platformTransformers, exports, user, userPermissions };
