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
 * Capacity response meta field.
 *
 * @type {*} Joi schema
 */
const capacityMetaSchema = metaResponseSchema;

/**
 * Capacity response item.
 *
 * @type {*} Joi schema
 */
const capacityItem = Joi.object({
  cores: Joi.number().allow(null).default(0),
  date: Joi.date().utc().allow(null),
  has_infinite_quantity: Joi.boolean().optional().allow(null),
  sockets: Joi.number().allow(null).default(0)
})
  .unknown(true)
  .default();

/**
 * Capacity response.
 *
 * @type {*} Joi schema
 */
const capacityResponseSchema = Joi.object().keys({
  data: Joi.array().items(capacityItem).default([]),
  links: linksSchema.default({}),
  meta: capacityMetaSchema.default({})
});

/**
 * Guests response meta field.
 *
 * @type {*} Joi schema
 */
const guestsMetaSchema = Joi.object()
  .keys({
    count: Joi.number().integer().default(0)
  })
  .unknown(true);

/**
 * Guests response item.
 *
 * @type {*} Joi schema
 */
const guestsItem = Joi.object({
  inventory_id: Joi.string().optional().allow(null),
  display_name: Joi.string().optional().allow(null),
  subscription_manager_id: Joi.string().optional().allow(null),
  last_seen: Joi.date().utc().allow(null)
})
  .unknown(true)
  .default();

/**
 * Guests response.
 *
 * @type {*} Joi schema
 */
const guestsResponseSchema = Joi.object().keys({
  data: Joi.array().items(guestsItem).default([]),
  links: linksSchema.default({}),
  meta: guestsMetaSchema.default({})
});

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
  billing_provider: Joi.string().optional().allow(null),
  billing_account_id: Joi.string().optional().allow(null),
  measurements: Joi.array().default([]),
  subscription_manager_id: Joi.string().optional().allow(null),
  last_seen: Joi.date().utc().allow(null)
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
 * Subscriptions response meta field.
 *
 * @type {*} Joi schema
 */
const subscriptionsMetaSchema = metaResponseSchema
  .keys({
    subscription_type: Joi.string().valid(null, ...Object.values(rhsmConstants.RHSM_API_RESPONSE_SUBSCRIPTION_TYPES))
  })
  .unknown(true);

/**
 * Subscriptions response item.
 *
 * @type {*} Joi schema
 */
const subscriptionsItem = Joi.object({
  has_infinite_quantity: Joi.boolean().optional().allow(null),
  next_event_date: Joi.date().utc().allow(null),
  product_name: Joi.string().optional().allow(null),
  quantity: Joi.number().allow(null).default(0),
  service_level: Joi.string().valid(...Object.values(rhsmConstants.RHSM_API_RESPONSE_SLA_TYPES)),
  total_capacity: Joi.number().allow(null).default(0),
  uom: Joi.string()
    .lowercase()
    .valid(...Object.values(rhsmConstants.RHSM_API_RESPONSE_UOM_TYPES))
})
  .unknown(true)
  .default();

/**
 * Subscriptions response.
 *
 * @type {*} Joi schema
 */
const subscriptionsResponseSchema = Joi.object().keys({
  data: Joi.array().items(subscriptionsItem).default([]),
  links: linksSchema.default({}),
  meta: subscriptionsMetaSchema.default({})
});

/**
 * Tally and capacity metric response item.
 *
 * @type {*} Joi schema
 */
// const tallyCapacityItem = Joi.object({
const tallyItem = Joi.object({
  date: Joi.date().utc().allow(null),
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
    // total_monthly: tallyCapacityItem
  })
  .unknown(true);

/*
const capacityMetaSchema = metaResponseSchema
  .keys({
    metric_id: Joi.string().valid(...Object.values(rhsmConstants.RHSM_API_PATH_METRIC_TYPES)),
  })
  .unknown(true);
*/

/**
 * Tally response.
 *
 * @type {*} Joi schema
 */
const tallyResponseSchema = Joi.object().keys({
  // data: Joi.array().items(tallyCapacityItem).default([]),
  data: Joi.array().items(tallyItem).default([]),
  links: linksSchema.default({}),
  meta: tallyMetaSchema.default({})
});

/*
const capacityResponseSchema = Joi.object().keys({
  data: Joi.array().items(tallyCapacityItem).default([]),
  links: linksSchema.default({}),
  meta: capacityMetaSchema.default({})
});
 */

const rhsmSchemas = {
  capacity: response => schemaResponse({ response, schema: capacityResponseSchema, id: 'RHSM capacity' }),
  errors: response => schemaResponse({ response, schema: errorResponseSchema, id: 'RHSM errors' }),
  guests: response => schemaResponse({ response, casing: 'camel', schema: guestsResponseSchema, id: 'RHSM guests' }),
  instances: response => schemaResponse({ response, schema: instancesResponseSchema, id: 'RHSM instances' }),
  subscriptions: response =>
    schemaResponse({ response, schema: subscriptionsResponseSchema, id: 'RHSM subscriptions' }),
  tally: response => schemaResponse({ response, schema: tallyResponseSchema, id: 'RHSM tally' })
};

export { rhsmSchemas as default, rhsmSchemas };
