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
  const {
    schema = [platformSchemas.user],
    transform = [platformTransformers.user],
    getUser: aliasGetUser = helpers.noop
  } = options;
  const platformMethod =
    (helpers.DEV_MODE &&
      (() => ({
        [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY]: {
          [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER]: {
            [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN]:
              process.env.REACT_APP_DEBUG_ORG_ADMIN === 'true'
          },
          [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.ORG_ID]: '12345'
        }
      }))) ||
    aliasGetUser;

  return axiosServiceCall({
    url: async () => {
      try {
        return platformMethod();
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
  const {
    schema = [platformSchemas.permissions],
    transform = [platformTransformers.permissions],
    getUserPermissions: aliasGetUserPermissions = helpers.noop
  } = options;
  const updatedAppName = (Array.isArray(appName) && appName) || [appName];
  const platformMethod =
    (helpers.DEV_MODE &&
      (() => [
        {
          [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_ONE
        },
        {
          [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_TWO
        }
      ])) ||
    aliasGetUserPermissions;

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
 * @apiMock {ForceStatus} 202
 * @api {delete} /api/export/v1/exports/:id
 * @apiDescription Create an export
 *
 * Reference [EXPORTS API](https://github.com/RedHatInsights/export-service-go/blob/main/static/spec/openapi.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 202 OK
 *     {}
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *     }
 */
/**
 * Delete an export. Useful for clean up. Helps avoid having to deal with export lists and most recent exports.
 *
 * @param {string} id ID of export to delete
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const deleteExport = (id, options = {}) => {
  const { cache = false, cancel = true, cancelId } = options;
  return axiosServiceCall({
    url: `${process.env.REACT_APP_SERVICES_PLATFORM_EXPORT}/${id}`,
    method: 'delete',
    cache,
    cancel,
    cancelId
  });
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
 *           "status": "pending"
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-rhel-for-x86-els-payg",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "complete"
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
 *           "status": "pending"
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-rhel-for-x86-els-payg",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "csv",
 *           "status": "failed"
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
 *           "status": "complete"
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "swatch-rhel-for-x86-els-payg",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "complete"
 *         },
 *         {
 *           "id": "x123456-5717-4562-b3fc-2c963f66afa6",
 *           "name": "unknown-export",
 *           "created_at": "2024-01-24T16:20:31.229Z",
 *           "completed_at": "2024-01-24T16:20:31.229Z",
 *           "expires_at": "2024-01-24T16:20:31.229Z",
 *           "format": "json",
 *           "status": "partial"
 *         }
 *       ]
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": []
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
 *       "status": "partial"
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
const getExistingExportsStatus = (id, params = {}, options = {}) => {
  const {
    cache = false,
    cancel = true,
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
 * @param {string} options.fileName
 * @param {string} options.fileType
 * @returns {Promise<*>}
 */
const getExport = (id, options = {}) => {
  const {
    cache = false,
    cancel = true,
    cancelId,
    fileName = `swatch_report_${id}`,
    fileType = helpers.CONFIG_EXPORT_FILE_TYPE
  } = options;
  return axiosServiceCall({
    url: `${process.env.REACT_APP_SERVICES_PLATFORM_EXPORT}/${id}`,
    responseType: 'blob',
    cache,
    cancel,
    cancelId
  })
    .then(
      success =>
        (helpers.TEST_MODE && success.data) ||
        downloadHelpers.downloadData({
          data: success.data,
          fileName: `${fileName}.${helpers.CONFIG_EXPORT_FILE_EXT}`,
          fileType
        })
    )
    .then(() => deleteExport(id));
};

/**
 * Convenience wrapper for setting up global export status with status polling, and download with clean-up.
 *
 * @param {Array<{id: string, fileName: string}>} idList A list of export IDs to finish
 * @param {object} params
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getExistingExports = (idList, params = {}, options = {}) => {
  const {
    cache = false,
    cancel = true,
    cancelId = 'all-exports',
    poll,
    schema = [platformSchemas.exports],
    transform = [platformTransformers.exports],
    ...restOptions
  } = options;

  return axiosServiceCall({
    ...restOptions,
    poll: {
      location: {
        url: process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
        ...poll?.location
      },
      validate: async response => {
        // FixMe: replace classic querySelector logic for "does the ui wrapper exist?" with external service cancel
        if (!document.querySelector('.curiosity') || response?.data?.data?.isAnything === false) {
          return true;
        }

        const failedResults = response?.data?.data?.failed || [];
        const completedResults = response?.data?.data?.completed || [];

        // Check if any of the requested exports have failed
        const failedIds = idList.filter(
          ({ id }) => failedResults.find(({ id: failedId }) => failedId === id) !== undefined
        );

        // Check if any of the requested exports have completed
        const completedIds = idList.filter(
          ({ id }) => completedResults.find(({ id: completedId }) => completedId === id) !== undefined
        );

        // Any export has failed, stop and cleanup. We `await` to avoid ID conflicts with polling against the service.
        if (failedIds.length > 0) {
          await Promise.all(failedIds.map(({ id }) => deleteExport(id))).catch(error => {
            if (!helpers.PROD_MODE) {
              console.warn('Failed to delete exports:', error);
            }
          });
        }

        // Any export completed, download it. We `await` to avoid ID conflicts with polling against the service.
        if (completedResults.length > 0) {
          await Promise.all(completedIds.map(({ id, fileName }) => getExport(id, { fileName }))).catch(error => {
            if (!helpers.PROD_MODE) {
              console.warn('Failed to download exports:', error);
            }
          });
        }

        return (
          idList.filter(
            ({ id }) =>
              completedIds.find(({ id: completedId }) => completedId === id) === undefined &&
              failedIds.find(({ id: failedId }) => failedId === id) === undefined
          ).length === 0
        );
      },
      ...poll
    },
    url: process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

/**
 * Note: 202 status appears to be only response that returns a sources list, OR it's variable depending on
 *     partial/pending status.
 */
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
 * Convenience wrapper for posting to create an export with status polling, then performing a download with clean-up.
 *
 * @param {object} data JSON data to submit
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const postExport = async (data = {}, options = {}) => {
  const {
    cache = false,
    cancel = false,
    cancelId,
    poll,
    schema = [platformSchemas.exports],
    transform = [],
    ...restOptions
  } = options;

  let downloadId;
  const postResponse = await axiosServiceCall({
    ...restOptions,
    poll: {
      ...poll,
      location: {
        url: process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
        config: {
          cache: false,
          cancel: false,
          schema: [platformSchemas.exports],
          transform: [platformTransformers.exports]
        },
        ...poll?.location
      },
      status: (successResponse, ...args) => {
        // FixMe: replace classic querySelector logic for "does the ui wrapper exist?" with external service cancel
        if (document.querySelector('.curiosity') && typeof poll?.status === 'function') {
          poll.status.call(null, successResponse, ...args);
        }
      },
      validate: async response => {
        // FixMe: replace classic querySelector logic for "does the ui wrapper exist?" with external service cancel
        if (!document.querySelector('.curiosity') || response?.data?.data?.isAnything === false) {
          return true;
        }

        const foundFailed = response?.data?.data?.failed?.find(
          ({ id }) => downloadId !== undefined && id === downloadId
        );

        const foundDownload = response?.data?.data?.completed.find(
          ({ id }) => downloadId !== undefined && id === downloadId
        );

        // Export has failed, stop and cleanup. We `await` to avoid ID conflicts with polling against the service.
        if (foundFailed) {
          const { id } = foundFailed;
          await deleteExport(id).catch(error => {
            if (!helpers.PROD_MODE) {
              console.warn('Failed to delete export:', error);
            }
          });
        }

        // Export completed, download it. We `await` to avoid ID conflicts with polling against the service.
        if (foundDownload) {
          const { id, fileName } = foundDownload;
          await getExport(id, { fileName }).catch(error => {
            if (!helpers.PROD_MODE) {
              console.warn('Failed to download export:', error);
            }
          });
        }

        return foundDownload !== undefined || foundFailed !== undefined;
      }
    },
    method: 'post',
    url: process.env.REACT_APP_SERVICES_PLATFORM_EXPORT,
    data,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });

  downloadId = postResponse.data.id;
  return postResponse;
};

const platformServices = {
  deleteExport,
  getExistingExports,
  getExistingExportsStatus,
  getExport,
  getUser,
  getUserPermissions,
  postExport
};

/**
 * Expose services to the browser's developer console.
 */
helpers.browserExpose({ platformServices });

export {
  platformServices as default,
  platformServices,
  deleteExport,
  getExistingExports,
  getExistingExportsStatus,
  getExport,
  getUser,
  getUserPermissions,
  postExport
};
