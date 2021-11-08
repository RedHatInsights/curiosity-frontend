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
const tallyMetaSchema = Joi.object()
  .keys({
    count: Joi.number().integer().default(0),
    has_cloudigrade_data: Joi.boolean().optional().allow(null),
    has_cloudigrade_mismatch: Joi.boolean().optional().allow(null),
    metric_id: Joi.string().valid(...Object.values(rhsmConstants.RHSM_API_PATH_METRIC_TYPES)),
    product: Joi.string().valid(...Object.values(rhsmConstants.RHSM_API_PATH_PRODUCT_TYPES)),
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
  tally: response => schemaResponse({ response, schema: tallyResponseSchema, id: 'RHSM tally' })
};

export { rhsmSchemas as default, rhsmSchemas };
