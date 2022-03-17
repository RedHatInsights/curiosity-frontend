import JoiBase from 'joi';
import JoiDate from '@joi/date';
import { schemaResponse } from '../common/helpers';

const Joi = JoiBase.extend(JoiDate);

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
  user: response => schemaResponse({ response, schema: userResponseSchema, id: 'User auth' }),
  permissions: response => schemaResponse({ response, schema: permissionsResponseSchema, id: 'Permissions auth' })
};

export { platformSchemas as default, platformSchemas };
