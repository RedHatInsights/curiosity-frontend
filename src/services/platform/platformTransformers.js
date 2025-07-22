import moment from 'moment';
import _snakeCase from 'lodash/snakeCase';
import { rbacConfig } from '../../config';
import {
  platformConstants,
  PLATFORM_API_EXPORT_STATUS_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_OPERATION_TYPES as OPERATION_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_RESOURCE_TYPES as RESOURCE_TYPES
} from './platformConstants';
import { helpers, dateHelpers } from '../../common';
import { platformHelpers } from './platformHelpers';

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

  updatedResponse.data.isAnything = false;
  updatedResponse.data.isAnythingPending = false;
  updatedResponse.data.isAnythingCompleted = false;
  updatedResponse.data.isAnythingFailed = false;
  updatedResponse.data.isPending = false;
  updatedResponse.data.isCompleted = false;
  updatedResponse.data.isFailed = false;
  updatedResponse.data.pending ??= [];
  updatedResponse.data.completed ??= [];
  updatedResponse.data.failed ??= [];
  updatedResponse.data.products = {};

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
    const productId = platformHelpers.getExportProductId(exportName);
    const focusedStatus = platformHelpers.getExportStatus(exportStatus);

    const updatedExportData = {
      fileName: `${moment.utc(dateHelpers.getCurrentDate()).format('YYYYMMDD_HHmmss')}_${exportFormat}_${helpers.CONFIG_EXPORT_FILENAME.replace('{0}', _snakeCase(productId))}`,
      format: exportFormat,
      id: exportId,
      name: exportName,
      productId,
      status: focusedStatus
    };

    updatedResponse.data.products[productId] ??= {};
    updatedResponse.data.products[productId].pending ??= [];
    updatedResponse.data.products[productId].completed ??= [];
    updatedResponse.data.products[productId].failed ??= [];

    switch (focusedStatus) {
      case PLATFORM_API_EXPORT_STATUS_TYPES.PENDING:
        updatedResponse.data.pending.push(updatedExportData);
        updatedResponse.data.products[productId].pending.push(updatedExportData);
        break;
      case PLATFORM_API_EXPORT_STATUS_TYPES.COMPLETE:
        updatedResponse.data.completed.push(updatedExportData);
        updatedResponse.data.products[productId].completed.push(updatedExportData);
        break;
      case PLATFORM_API_EXPORT_STATUS_TYPES.FAILED:
        updatedResponse.data.failed.push(updatedExportData);
        updatedResponse.data.products[productId].failed.push(updatedExportData);
        break;
    }
  };

  if (Array.isArray(data)) {
    data
      .filter(({ [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.NAME]: exportName }) =>
        new RegExp(`^${helpers.CONFIG_EXPORT_SERVICE_NAME_PREFIX}`, 'i').test(exportName)
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
  } else if (id && status && new RegExp(`^${helpers.CONFIG_EXPORT_SERVICE_NAME_PREFIX}`, 'i').test(name)) {
    restructureResponse({ exportName: name, exportStatus: status, exportFormat: format, exportId: id });
  }

  updatedResponse.data.isAnythingPending = updatedResponse.data.pending.length > 0;
  updatedResponse.data.isAnythingCompleted = updatedResponse.data.completed.length > 0;
  updatedResponse.data.isAnythingFailed = updatedResponse.data.failed.length > 0;
  updatedResponse.data.isAnything =
    updatedResponse.data.isAnythingPending ||
    updatedResponse.data.isAnythingCompleted ||
    updatedResponse.data.isAnythingFailed;

  if (updatedResponse.data.isAnything === false) {
    return updatedResponse;
  }

  Object.entries(updatedResponse.data.products).forEach(([productId, { pending, completed, failed } = {}]) => {
    // Anything pending still
    updatedResponse.data.products[productId].isPending = pending.length > 0;

    // Only consider the entire product line as `complete` if there are no `pending` exports.
    updatedResponse.data.products[productId].isCompleted =
      (completed.length > 0 && !updatedResponse.data.products[productId].isPending) || false;

    // Only consider the entire product line as `failed` if there are no `pending` or `completed` exports.
    updatedResponse.data.products[productId].isFailed =
      (failed.length > 0 &&
        !updatedResponse.data.products[productId].isPending &&
        !updatedResponse.data.products[productId].isCompleted) ||
      false;
  });

  // Anything pending still
  updatedResponse.data.isPending = updatedResponse.data.pending.length > 0;

  // Only consider the entire line as `complete` if there are no `pending` exports.
  updatedResponse.data.isCompleted =
    (updatedResponse.data.completed.length > 0 && !updatedResponse.data.isPending) || false;

  // Only consider the entire line as `failed` if there are no `pending` or `completed` exports.
  updatedResponse.data.isFailed =
    (updatedResponse.data.failed.length > 0 && !updatedResponse.data.isPending && !updatedResponse.data.isCompleted) ||
    false;

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

  updatedResponse.orgId = identity?.[platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.ORG_ID];

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
    } = {}) => {
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
