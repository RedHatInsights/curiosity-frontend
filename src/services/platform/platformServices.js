import _set from 'lodash/set';
import { rbacConfig } from '../../config';
import { axiosServiceCall } from '../common/serviceConfig';
import { platformSchemas } from './platformSchemas';
import { platformTransformers } from './platformTransformers';
import { helpers } from '../../common';
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
 * @api {post} /api/export/v1/exports
 * @apiDescription Create an export
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *       "name": "string",
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
 *           "status": "partial"
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
    cancelId,
    schema = [platformSchemas.exports],
    transform = [platformTransformers.exports]
  } = options;
  return axiosServiceCall({
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
 * @param {id} id Export ID
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getExport = (id, options = {}) => {
  const { cache = false, cancel = true, cancelId } = options;
  return axiosServiceCall({
    url: `${process.env.REACT_APP_SERVICES_PLATFORM_EXPORT}/${id}`,
    cache,
    cancel,
    cancelId
  });
};

/**
 * @api {get} /api/export/v1/exports/:id/status
 * @apiDescription Create an export
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *       "name": "string",
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
 *           "status": "partial"
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
 * Get an export status after setup.
 *
 * @param {id} id Export ID
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getExportStatus = (id, options = {}) => {
  const {
    cache = false,
    cancel = true,
    cancelId,
    schema = [platformSchemas.exports],
    transform = [platformTransformers.exports]
  } = options;
  return axiosServiceCall({
    url: process.env.REACT_APP_SERVICES_PLATFORM_EXPORT_STATUS.replace('{0}', id),
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

const platformServices = {
  getUser,
  getUserPermissions,
  hideGlobalFilter,
  postExport,
  getExport,
  getExportStatus
};

/**
 * Expose services to the browser's developer console.
 */
helpers.browserExpose({ platformServices });

export {
  platformServices as default,
  platformServices,
  getUser,
  getUserPermissions,
  hideGlobalFilter,
  postExport,
  getExport,
  getExportStatus
};
