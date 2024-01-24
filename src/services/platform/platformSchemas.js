import JoiBase from 'joi';
import JoiDate from '@joi/date';
import { schemaResponse } from '../common/helpers';
import platformConstants from './platformConstants';

/**
 * @memberof Platform
 * @module PlatformSchemas
 */

/**
 * Extend Joi with date.
 *
 * @type {*}
 */
const Joi = JoiBase.extend(JoiDate);

/**
 * Export response source item.
 *
 * @type {*} Joi schema
 */
const exportsItem = Joi.object({
  application: Joi.string(),
  resource: Joi.string(),
  filters: Joi.object().optional().allow(null),
  id: Joi.string().guid(),
  status: Joi.string().valid(...Object.values(platformConstants.PLATFORM_API_EXPORT_STATUS_TYPES))
})
  .unknown(true)
  .default();

/**
 * Export response.
 *
 * @type {*} Joi schema
 */
const exportsResponseSchema = Joi.object()
  .keys({
    id: Joi.string().guid(),
    name: Joi.string(),
    created_at: Joi.date().utc(),
    completed_at: Joi.date().utc().optional().allow(null),
    expires_at: Joi.date().utc().optional().allow(null),
    format: Joi.string().valid(...Object.values(platformConstants.PLATFORM_API_EXPORT_CONTENT_TYPES)),
    status: Joi.string().valid(...Object.values(platformConstants.PLATFORM_API_EXPORT_STATUS_TYPES)),
    sources: Joi.array().items(exportsItem).default([])
  })
  .unknown(true)
  .default({});

/**
 * User response item.
 *
 * @type {*} Joi schema
 */
const userResponseSchema = Joi.object()
  .keys({
    identity: Joi.object({
      user: Joi.object({
        is_org_admin: Joi.boolean().default(false)
      })
        .unknown(true)
        .default({})
    })
      .unknown(true)
      .default({}),
    entitlements: Joi.object({
      [process.env.REACT_APP_UI_NAME]: Joi.object({
        is_entitled: Joi.boolean().default(false)
      })
        .unknown(true)
        .default({})
    })
      .unknown(true)
      .default({})
  })
  .unknown(true)
  .default({});

/**
 * Permissions response item.
 *
 * @type {*} Joi schema
 */
const permissionsItem = Joi.object({
  permission: Joi.string().optional().allow(null),
  resourceDefinitions: Joi.array().optional().default([])
})
  .unknown(true)
  .default();

/**
 * Authorize response.
 *
 * @type {*} Joi schema
 */
const permissionsResponseSchema = Joi.array().items(permissionsItem).default([]);

const platformSchemas = {
  exports: response => schemaResponse({ response, schema: exportsResponseSchema, id: 'Export status' }),
  user: response => schemaResponse({ response, schema: userResponseSchema, id: 'User auth' }),
  permissions: response => schemaResponse({ response, schema: permissionsResponseSchema, id: 'Permissions auth' })
};

export { platformSchemas as default, platformSchemas };
