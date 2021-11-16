import JoiBase from 'joi';
import JoiDate from '@joi/date';
import { schemaResponse } from '../common/helpers';
import { rhsmConstants } from './rhsmConstants';

const Joi = JoiBase.extend(JoiDate);

/**
 * Error response item.
 *
 * @type {*} Joi schema
 */
const errorItem = Joi.object({
  code: Joi.string().default(null),
  detail: Joi.string().default(null)
}).unknown(true);

/**
 * Error response.
 *
 * @type {*} Joi schema
 */
const errorResponseSchema = Joi.object()
  .keys({
    errors: Joi.array().items(errorItem).default([])
  })
  .unknown(true);

const linksSchema = Joi.object();

/**
 * RHSM base response meta field.
 *
 * @type {*} Joi schema
 */
const metaResponseSchema = Joi.object()
  .keys({
    count: Joi.number().integer().default(0),
    product: Joi.string().valid(...Object.values(rhsmConstants.RHSM_API_PATH_PRODUCT_TYPES))
  })
  .unknown(true);

/**
 * Instances response meta field.
 *
 * @type {*} Joi schema
 */
const instancesMetaSchema = metaResponseSchema
  .keys({
    measurements: Joi.array()
      .items(Joi.string().valid(...Object.values(rhsmConstants.RHSM_API_PATH_METRIC_TYPES)))
      .default([])
  })
  .unknown(true);

/**
 * Instances response item.
 *
 * @type {*} Joi schema
 */
const instancesItem = Joi.object({
  inventory_id: Joi.string().optional().allow(null),
  display_name: Joi.string().optional().allow(null),
  measurements: Joi.array().default([]),
  subscription_manager_id: Joi.string().optional().allow(null),
  last_seen: Joi.date().allow(null)
})
  .unknown(true)
  .default();

/**
 * Instances response.
 *
 * @type {*} Joi schema
 */
const instancesResponseSchema = Joi.object().keys({
  data: Joi.array().items(instancesItem).default([]),
  links: linksSchema.default({}),
  meta: instancesMetaSchema.default({})
});

/**
 * Tally response item.
 *
 * @type {*} Joi schema
 */
const tallyItem = Joi.object({
  date: Joi.date().allow(null),
  has_data: Joi.boolean().optional().allow(null),
  value: Joi.number().allow(null).default(0)
})
  .unknown(true)
  .default();

/**
 * Tally response meta field.
 *
 * @type {*} Joi schema
 */
const tallyMetaSchema = metaResponseSchema
  .keys({
    has_cloudigrade_data: Joi.boolean().optional().allow(null),
    has_cloudigrade_mismatch: Joi.boolean().optional().allow(null),
    metric_id: Joi.string().valid(...Object.values(rhsmConstants.RHSM_API_PATH_METRIC_TYPES)),
    total_monthly: tallyItem
  })
  .unknown(true);

/**
 * Tally response.
 *
 * @type {*} Joi schema
 */
const tallyResponseSchema = Joi.object().keys({
  data: Joi.array().items(tallyItem).default([]),
  links: linksSchema.default({}),
  meta: tallyMetaSchema.default({})
});

const rhsmSchemas = {
  errors: response => schemaResponse({ response, schema: errorResponseSchema, id: 'RHSM errors' }),
  instances: response => schemaResponse({ response, schema: instancesResponseSchema, id: 'RHSM instances' }),
  tally: response => schemaResponse({ response, schema: tallyResponseSchema, id: 'RHSM tally' })
};

export { rhsmSchemas as default, rhsmSchemas };
