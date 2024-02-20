import _set from 'lodash/set';
import { rbacConfig } from '../../config';
import { axiosServiceCall } from '../common/serviceConfig';
import { platformSchemas } from './platformSchemas';
import { platformTransformers } from './platformTransformers';
import { helpers, downloadHelpers } from '../../common';
import {
  platformConstants,
  PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES as USER_PERMISSION_TYPES
} from './platformConstants';

/**
 * Emulated service calls for platform globals.
 *
 * @memberof Platform
 * @module PlatformServices
 */

/**
 * Basic user authentication.
 *
 * @param {object} options
 * @returns {Promise<*>}
 */
const getUser = async (options = {}) => {
  const { schema = [platformSchemas.user], transform = [platformTransformers.user] } = options;
  const { insights } = window;
  return axiosServiceCall({
    url: async () => {
      try {
        return (
          (helpers.DEV_MODE &&
            _set(
              {},
              [
                platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY,
                platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER,
                platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN
              ],
              process.env.REACT_APP_DEBUG_ORG_ADMIN === 'true'
            )) ||
          (await insights.chrome.auth.getUser())
        );
      } catch (e) {
        throw new Error(`{ getUser } = insights.chrome.auth, ${e.message}`);
      }
    },
    schema,
    transform
  });
};

/**
 * Basic user permissions.
 *
 * @param {string} appName
 * @param {object} options
 * @returns {Promise<*>}
 */
const getUserPermissions = (appName = Object.keys(rbacConfig), options = {}) => {
  const { schema = [platformSchemas.permissions], transform = [platformTransformers.permissions] } = options;
  const updatedAppName = (Array.isArray(appName) && appName) || [appName];
  const { insights } = window;
  const platformMethod = name =>
    (helpers.DEV_MODE && [
      {
        [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_ONE
      },
      {
        [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_TWO
      }
    ]) ||
    insights.chrome.getUserPermissions(name);

  return axiosServiceCall({
    url: async () => {
      let userPermissions;

      try {
        const allPermissions = await Promise.all(updatedAppName.map(name => platformMethod(name)));

        if (Array.isArray(allPermissions)) {
          userPermissions = [...allPermissions.flat()];
        }
      } catch (e) {
        throw new Error(`{ getUserPermissions } = insights.chrome, ${e.message}`);
      }

      return userPermissions;
    },
    schema,
    transform
  });
};

/**
 * Disables the Platform's global filter display.
 *
 * @param {boolean} isHidden
 * @returns {Promise<*>}
 */
const hideGlobalFilter = async (isHidden = true) => {
  const { insights } = window;
  try {
    await insights.chrome.hideGlobalFilter(isHidden);
  } catch (e) {
    throw new Error(`{ on } = insights.chrome, ${e.message}`);
  }
};

/**
 * @api {get} /api/export/v1/exports/:id
 * @apiDescription Get an export by id
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {zip} Success-Response:
 *     HTTP/1.1 200 OK
 *     Success
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       message: "'---' is not a valid export UUID",
 *       code: 400
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *     }
 */
/**
 * Get an export after setup.
 *
 * @param {string} id Export ID
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getExport = (id, options = {}) => {
  const { cache = false, cancel = true, cancelId } = options;
  return axiosServiceCall({
    url: `${process.env.REACT_APP_SERVICES_PLATFORM_EXPORT}/${id}`,
    responseType: 'blob',
    cache,
    cancel,
    cancelId
  }).then(
    success =>
      (helpers.TEST_MODE && success.data) ||
      downloadHelpers.downloadData({
        data: success.data,
        fileName: `swatch_report_${id}.tar.gz`,
        fileType: 'application/gzip'
      })
  );
};

/**
 * @apiMock {DelayResponse} 2000
 * @apiMock {RandomSuccess}
 * @api {get} /api/export/v1/exports
 * @apiDescription Get multiple, or a single, export status
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-RHEL for x86",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "partial",
 *           "sources": [
 *             {
 *               "application": "subscriptions",
 *               "resource": "instances",
 *               "filters": {},
 *               "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *               "status": "pending"
 *             }
 *           ]
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-rhel-for-x86-els-payg",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "completed",
 *           "sources": [
 *             {
 *               "application": "subscriptions",
 *               "resource": "subscriptions",
 *               "filters": {},
 *               "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *               "status": "completed"
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-RHEL for x86",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "partial",
 *           "sources": [
 *             {
 *               "application": "subscriptions",
 *               "resource": "instances",
 *               "filters": {},
 *               "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *               "status": "pending"
 *             }
 *           ]
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-rhel-for-x86-els-payg",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "partial",
 *           "sources": [
 *             {
 *               "application": "subscriptions",
 *               "resource": "subscriptions",
 *               "filters": {},
 *               "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *               "status": "pending"
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-RHEL for x86",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "completed",
 *           "sources": [
 *             {
 *               "application": "subscriptions",
 *               "resource": "instances",
 *               "filters": {},
 *               "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *               "status": "completed"
 *             }
 *           ]
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-rhel-for-x86-els-payg",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "completed",
 *           "sources": [
 *             {
 *               "application": "subscriptions",
 *               "resource": "subscriptions",
 *               "filters": {},
 *               "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *               "status": "completed"
 *             }
 *           ]
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "unknown-export",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "partial",
 *           "sources": [
 *             {
 *               "application": "subscriptions",
 *               "resource": "subscriptions",
 *               "filters": {},
 *               "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *               "status": "pending"
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       message: "'---' is not valid",
 *       code: 400
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *     }
 */
/**
 * @api {get} /api/export/v1/exports/:id/status
 * @apiDescription Get a single export
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *       "name": "swatch-RHEL for x86",
 *       "created_at": "2024-01-24T16:20:31.229Z",
 *       "completed_at": "2024-01-24T16:20:31.229Z",
 *       "expires_at": "2024-01-24T16:20:31.229Z",
 *       "format": "json",
 *       "status": "partial",
 *       "sources": [
 *         {
 *           "application": "subscriptions",
 *           "resource": "instances",
 *           "filters": {},
 *           "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *           "status": "pending"
 *         }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       message: "'---' is not a valid export UUID",
 *       code: 400
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *     }
 */
/**
 * Get multiple export status, or a single status after setup.
 *
 * @param {string|undefined|null} id Export ID
 * @param {object} params
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getExportStatus = (id, params = {}, options = {}) => {
  const {
    cache = false,
    cancel = true,
    // cancelId = 'export-status',
    cancelId,
    schema = [platformSchemas.exports],
    transform = [platformTransformers.exports],
    ...restOptions
  } = options;
  return axiosServiceCall({
    ...restOptions,
    url:
      (id && process.env.REACT_APP_SERVICES_PLATFORM_EXPORT_STATUS.replace('{0}', id)) ||
      process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

/**
 * @apiMock {ForceStatus} 202
 * @api {post} /api/export/v1/exports
 * @apiDescription Create an export
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 202 OK
 *     {
 *       "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *       "name": "swatch-RHEL for x86",
 *       "created_at": "2024-01-24T16:20:31.229Z",
 *       "completed_at": "2024-01-24T16:20:31.229Z",
 *       "expires_at": "2024-01-24T16:20:31.229Z",
 *       "format": "json",
 *       "status": "partial",
 *       "sources": [
 *         {
 *           "application": "subscriptions",
 *           "resource": "instances",
 *           "filters": {},
 *           "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *           "status": "pending"
 *         }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *     }
 */
/**
 * Post to create an export.
 *
 * @param {object} data JSON data to submit
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const postExport = (data = {}, options = {}) => {
  const {
    cache = false,
    cancel = true,
    cancelId, // = 'export-status',
    schema = [platformSchemas.exports],
    transform = [platformTransformers.exports],
    ...restOptions
  } = options;
  return axiosServiceCall({
    ...restOptions,
    method: 'post',
    url: process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
    data,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

const platformServices = {
  getExport,
  getExportStatus,
  getUser,
  getUserPermissions,
  hideGlobalFilter,
  postExport
};

/**
 * Expose services to the browser's developer console.
 */
helpers.browserExpose({ platformServices });

export {
  platformServices as default,
  platformServices,
  getExport,
  getExportStatus,
  getUser,
  getUserPermissions,
  hideGlobalFilter,
  postExport
};
