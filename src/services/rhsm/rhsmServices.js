import { serviceCall } from '../config';
import { rhsmSchemas } from './rhsmSchemas';
import { helpers } from '../../common';
import { rhsmTransformers } from './rhsmTransformers';
import { rhsmHelpers } from './rhsmHelpers';

/**
 * RHSM API service calls.
 *
 * @memberof Rhsm
 * @module RhsmServices
 */

/**
 * ToDo: remove rhsmHelpers.filterArchitectureVariant
 * We're using a temporary helper to emulate a param for architectures and/or variants.
 * When the api supports architecture and variant query params this needs to be refactored.
 */

/**
 * @api {get} /api/rhsm-subscriptions/v1/version
 * @apiDescription Retrieve API version information
 *
 * Reference [RHSM API](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "build": {
 *         "version": "0.0.0",
 *         "gitDescription": "lorem ipsum",
 *         "artifact": "dolor sit",
 *         "name": "lorem",
 *         "group": "ipsum",
 *         "gitHash": "0000000000000000"
 *       }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Get RHSM API version information.
 *
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getApiVersion = (options = {}) => {
  const { cache = false, cancel = true, cancelId } = options;
  return serviceCall({
    url: process.env.REACT_APP_SERVICES_RHSM_VERSION,
    cache,
    cancel,
    cancelId
  });
};

/**
 * @apiMock {DelayResponse} 250
 * @apiMock {RandomSuccess}
 * @api {get} /api/rhsm-subscriptions/v1/tally/products/:product_id Get RHSM graph data
 * @apiDescription Retrieve graph data.
 *
 * Reference [RHSM for report params and commands](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiParam {string} product_id The ID for the product we wish to query.
 * - RHEL
 *
 * @apiParam (Query string) {string} granularity The level of granularity to return.
 * - DAILY
 * - WEEKLY
 * - MONTHLY
 * - QUARTERLY
 * - YEARLY
 * @apiParam (Query string) {Date} beginning Defines the start of the report period. Dates should be provided in ISO 8601 format but the only accepted offset is UTC. E.g. 2017-07-21T17:32:28Z
 * @apiParam (Query string) {Date} ending Defines the end of the report period. Defaults to the current time. Dates should be provided in UTC.
 * @apiParam (Query string) {Number} [limit] The numbers of items to return.
 * @apiParam (Query string) {Number} [offset] The number of items to skip before starting to collect the result set.
 *
 * @apiSuccess {Array} data
 * @apiSuccess {object} links
 * @apiSuccess {object} meta
 * @apiSuccess {string} meta.granularity
 * - DAILY
 * - WEEKLY
 * - MONTHLY
 * - QUARTERLY
 * - YEARLY
 * @apiSuccess {string} meta.product
 * - RHEL
 * @apiSuccess {number} meta.resultSetSize
 *
 * @apiSuccessExample {json} DAILY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2020-07-01T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 80,
 *           "core_hours": 0,
 *           "instance_hours": 3
 *         },
 *         {
 *           "date": "2020-07-02T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 80,
 *           "core_hours": 10,
 *           "instance_hours": 2
 *         },
 *         {
 *           "date": "2020-07-03T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 80,
 *           "core_hours": 10,
 *           "instance_hours": 12
 *         },
 *         {
 *           "date": "2020-07-04T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 80,
 *           "core_hours": 10,
 *           "instance_hours": 4
 *         },
 *         {
 *           "date": "2020-07-05T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": 10,
 *           "instance_hours": 1
 *         },
 *         {
 *           "date": "2020-07-06T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 20,
 *           "core_hours": 1000.057890,
 *           "instance_hours": 2
 *         },
 *         {
 *           "date": "2020-07-07T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": 1000,
 *           "instance_hours": 2
 *         },
 *         {
 *           "date": "2020-07-08T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": 1000,
 *           "instance_hours": 3
 *         },
 *         {
 *           "date": "2020-07-09T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": 1000,
 *           "instance_hours": 3
 *         },
 *         {
 *           "date": "2020-07-10T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 3
 *         },
 *         {
 *           "date": "2020-07-11T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": null
 *         },
 *         {
 *           "date": "2020-07-12T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-13T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-14T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-15T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-16T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-17T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-18T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-19T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-20T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-21T00:00:00Z",
 *           "sockets": 24,
 *           "physical_sockets": 24,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 20,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-22T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 0,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-23T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 0,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-24T00:00:00Z",
 *           "sockets": 76,
 *           "physical_sockets": 36,
 *           "hypervisor_sockets": 40,
 *           "has_data": true,
 *           "cloud_sockets": 0,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-25T00:00:00Z",
 *           "sockets": 90,
 *           "physical_sockets": 40,
 *           "hypervisor_sockets": 50,
 *           "has_data": true,
 *           "cloud_sockets": 0,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-26T00:00:00Z",
 *           "sockets": 104,
 *           "physical_sockets": 44,
 *           "hypervisor_sockets": 60,
 *           "has_data": true,
 *           "cloud_sockets": 0,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-27T00:00:00Z",
 *           "sockets": 78,
 *           "physical_sockets": 48,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 0,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-28T00:00:00Z",
 *           "sockets": 82,
 *           "physical_sockets": 52,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 0,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-29T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-30T00:00:00Z",
 *           "sockets": 90,
 *           "physical_sockets": 60,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 40,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-31T00:00:00Z",
 *           "sockets": 144,
 *           "physical_sockets": 64,
 *           "hypervisor_sockets": 80,
 *           "has_data": true,
 *           "cloud_sockets": 40,
 *           "core_hours": null,
 *           "has_cloudigrade_data": true,
 *           "has_cloudigrade_mismatch": true,
 *           "instance_hours": 0
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=daily&beginning=2020-07-20T00:00:00.000Z&ending=2020-08-19T23:59:59.999Z&offset=0",
 *         "last": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=daily&beginning=2020-07-20T00:00:00.000Z&ending=2020-08-19T23:59:59.999Z&offset=0"
 *       },
 *       "meta": {
 *         "count": 12,
 *         "product": "RHEL",
 *         "granularity": "daily",
 *         "total_core_hours": 30500.04,
 *         "total_instance_hours": 35
 *       }
 *     }
 *
 * @apiSuccessExample {json} WEEKLY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2020-05-19T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": 10.20,
 *           "instance_hours": 1
 *         },
 *         {
 *           "date": "2020-05-26T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": 10.15,
 *           "instance_hours": 1
 *         },
 *         {
 *           "date": "2020-06-02T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": 10.11,
 *           "instance_hours": 1
 *         },
 *         {
 *           "date": "2020-06-09T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": 2000.32,
 *           "instance_hours": 23
 *         },
 *         {
 *           "date": "2020-06-16T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": 2000.42,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-06-23T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": 999.06,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-06-30T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-07T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-14T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-21T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-07-28T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-08-04T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60,
 *           "core_hours": null,
 *           "instance_hours": 0
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=weekly&beginning=2020-05-26T00:00:00.000Z&ending=2020-08-19T23:59:59.999Z&offset=0",
 *         "last": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=weekly&beginning=2020-05-26T00:00:00.000Z&ending=2020-08-19T23:59:59.999Z&offset=0"
 *       },
 *       "meta": {
 *         "count": 10,
 *         "product": "RHEL",
 *         "granularity": "weekly",
 *         "total_core_hours": 200.03,
 *         "total_instance_hours": 26
 *       }
 *     }
 *
 * @apiSuccessExample {json} MONTHLY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2019-08-01T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 25,
 *           "hypervisor_sockets": 50,
 *           "has_data": true,
 *           "cloud_sockets": 25,
 *           "core_hours": 200,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2019-09-01T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 25,
 *           "hypervisor_sockets": 50,
 *           "has_data": true,
 *           "cloud_sockets": 25,
 *           "core_hours": 200,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2019-10-01T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 25,
 *           "hypervisor_sockets": 50,
 *           "has_data": true,
 *           "cloud_sockets": 25,
 *           "core_hours": 400,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2019-11-01T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": null,
 *           "has_data": false,
 *           "cloud_sockets": 0,
 *           "core_hours": 0,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2019-12-01T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": null,
 *           "has_data": false,
 *           "cloud_sockets": 0,
 *           "core_hours": 0,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-01-01T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": null,
 *           "has_data": false,
 *           "cloud_sockets": 0,
 *           "core_hours": 0,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-02-01T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": null,
 *           "has_data": false,
 *           "cloud_sockets": 0,
 *           "core_hours": 0,
 *           "instance_hours": 0
 *         },
 *         {
 *           "date": "2020-03-01T00:00:00Z",
 *           "sockets": 3000,
 *           "physical_sockets": 500,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         },
 *         {
 *           "date": "2020-04-01T00:00:00Z",
 *           "sockets": 2600,
 *           "physical_sockets": 100,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         },
 *         {
 *           "date": "2020-05-01T00:00:00Z",
 *           "sockets": 3000,
 *           "physical_sockets": 500,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         },
 *         {
 *           "date": "2020-06-01T00:00:00Z",
 *           "sockets": 3000,
 *           "physical_sockets": 500,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         },
 *         {
 *           "date": "2020-07-01T00:00:00Z",
 *           "sockets": 3000,
 *           "physical_sockets": 500,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         },
 *         {
 *           "date": "2020-08-01T00:00:00Z",
 *           "sockets": 2600,
 *           "physical_sockets": 100,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=monthly&beginning=2019-08-01T00:00:00.000Z&ending=2020-08-19T23:59:59.999Z&offset=0",
 *         "last": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=monthly&beginning=2019-08-01T00:00:00.000Z&ending=2020-08-19T23:59:59.999Z&offset=0"
 *       },
 *       "meta": {
 *         "count": 6,
 *         "product": "RHEL",
 *         "granularity": "monthly",
 *         "total_core_hours": 2050.04
 *       }
 *     }
 *
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *        "errors": [
 *          {
 *            "code": "SUBSCRIPTIONS1004",
 *            "detail": "Opt-in required.",
 *            "status": "403",
 *            "title": "Access Denied"
 *          }
 *        ]
 *     }
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Get RHSM API reporting/tally graph/chart data.
 *
 * @deprecated The graph reports Tally call is replaced by independent Tally and Capacity metric calls.
 * @param {string} id Product ID
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getGraphReports = (id, params = {}, options = {}) => {
  const { cache = true, cancel = true, cancelId } = options;
  const updatedId = rhsmHelpers.filterArchitectureVariant(id, params);
  return serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_REPORT}${updatedId}`,
    params,
    cache,
    cancel,
    cancelId
  });
};

/**
 * @apiMock {DelayResponse} 2000
 * @apiMock {RandomSuccess}
 * @api {get} /api/rhsm-subscriptions/v1/tally/products/:product_id/Sockets Get RHSM graph data
 * @apiDescription Retrieve graph data.
 *
 * @apiSuccessExample {json} DAILY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2020-07-01T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-02T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-03T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-04T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-05T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-06T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-07T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-08T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-09T00:00:00Z",
 *           "value": 1000,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-10T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-11T00:00:00Z",
 *           "value": 50.090125,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-12T00:00:00Z",
 *           "has_data": null
 *         },
 *         {
 *           "date": "2020-07-13T00:00:00Z",
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-14T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-15T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-16T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-17T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-18T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-19T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-20T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-21T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-22T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-23T00:00:00Z",
 *           "value": 0,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-24T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-25T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-26T00:00:00Z",
 *           "value": 104,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-27T00:00:00Z",
 *           "value": 70,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-28T00:00:00Z",
 *           "value": 82,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-29T00:00:00Z",
 *           "value": 86,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-30T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 144,
 *           "has_data": true
 *         }
 *       ],
 *       "links": {},
 *       "meta": {
 *         "granularity": "daily",
 *         "has_cloudigrade_data": false,
 *         "has_cloudigrade_mismatch": true,
 *         "metric_id": "Sockets",
 *         "product": "RHEL",
 *         "service_level": "",
 *         "total_monthly": {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 50,
 *           "has_data": true
 *         },
 *         "usage": ""
 *       }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *        "errors": [
 *          {
 *            "code": "SUBSCRIPTIONS1004",
 *            "detail": "Opt-in required.",
 *            "status": "403",
 *            "title": "Access Denied"
 *          }
 *        ]
 *     }
 */
/**
 * @apiMock {DelayResponse} 250
 * @apiMock {RandomSuccess}
 * @api {get} /api/rhsm-subscriptions/v1/tally/products/:product_id/Cores Get RHSM graph data
 * @apiDescription Retrieve graph data.
 *
 * @apiSuccessExample {json} DAILY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2020-07-01T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-02T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-03T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-04T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-05T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-06T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-07T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-08T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-09T00:00:00Z",
 *           "value": 1000,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-10T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-11T00:00:00Z",
 *           "value": 50.090125,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-12T00:00:00Z",
 *           "has_data": null
 *         },
 *         {
 *           "date": "2020-07-13T00:00:00Z",
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-14T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-15T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-16T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-17T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-18T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-19T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-20T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-21T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-22T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-23T00:00:00Z",
 *           "value": 0,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-24T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-25T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-26T00:00:00Z",
 *           "value": 104,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-27T00:00:00Z",
 *           "value": 70,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-28T00:00:00Z",
 *           "value": 82,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-29T00:00:00Z",
 *           "value": 86,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-30T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 144,
 *           "has_data": true
 *         }
 *       ],
 *       "links": {},
 *       "meta": {
 *         "granularity": "daily",
 *         "has_cloudigrade_data": false,
 *         "has_cloudigrade_mismatch": true,
 *         "metric_id": "Cores",
 *         "product": "RHEL",
 *         "service_level": "",
 *         "total_monthly": {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 50,
 *           "has_data": true
 *         },
 *         "usage": ""
 *       }
 *     }
 */
/**
 * @apiMock {DelayResponse} 1000
 * @apiMock {RandomSuccess}
 * @api {get} /api/rhsm-subscriptions/v1/tally/products/:product_id/Transfer-gibibytes Get RHSM graph data
 * @apiDescription Retrieve graph data.
 *
 * @apiSuccessExample {json} DAILY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2020-07-01T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-02T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-03T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-04T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-05T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-06T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-07T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-08T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-09T00:00:00Z",
 *           "value": 1000,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-10T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-11T00:00:00Z",
 *           "value": 50,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-12T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-13T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-14T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-15T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-16T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-17T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-18T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-19T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-20T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-21T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-22T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-23T00:00:00Z",
 *           "value": 0,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-24T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-25T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-26T00:00:00Z",
 *           "value": 104,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-27T00:00:00Z",
 *           "value": 70,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-28T00:00:00Z",
 *           "value": 82,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-29T00:00:00Z",
 *           "value": 86,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-30T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 144,
 *           "has_data": true
 *         }
 *       ],
 *       "links": {},
 *       "meta": {
 *         "count": 31,
 *         "granularity": "daily",
 *         "has_cloudigrade_data": true,
 *         "has_cloudigrade_mismatch": true,
 *         "metric_id": "Transfer-gibibytes",
 *         "product": "RHEL",
 *         "service_level": "",
 *         "total_monthly": {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 1024,
 *           "has_data": true
 *         },
 *         "usage": ""
 *       }
 *     }
 */
/**
 * @apiMock {DelayResponse} 250
 * @apiMock {RandomSuccess}
 * @api {get} /api/rhsm-subscriptions/v1/tally/products/:product_id/Storage-gibibytes Get RHSM graph data
 * @apiDescription Retrieve graph data.
 *
 * @apiSuccessExample {json} DAILY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2020-07-01T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-02T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-03T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-04T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-05T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-06T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-07T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-08T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-09T00:00:00Z",
 *           "value": 1000,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-10T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-11T00:00:00Z",
 *           "value": 50,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-12T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-13T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-14T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-15T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-16T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-17T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-18T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-19T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-20T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-21T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-22T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-23T00:00:00Z",
 *           "value": 0,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-24T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-25T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-26T00:00:00Z",
 *           "value": 104,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-27T00:00:00Z",
 *           "value": 70,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-28T00:00:00Z",
 *           "value": 82,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-29T00:00:00Z",
 *           "value": 86,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-30T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 144,
 *           "has_data": true
 *         }
 *       ],
 *       "links": {},
 *       "meta": {
 *         "count": 31,
 *         "granularity": "daily",
 *         "has_cloudigrade_data": true,
 *         "has_cloudigrade_mismatch": true,
 *         "metric_id": "Storage-gibibyte",
 *         "product": "RHEL",
 *         "service_level": "",
 *         "total_monthly": {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 2048,
 *           "has_data": true
 *         },
 *         "usage": ""
 *       }
 *     }
 */
/**
 * @apiMock {DelayResponse} 250
 * @apiMock {RandomSuccess}
 * @api {get} /api/rhsm-subscriptions/v1/tally/products/:product_id/Storage-gibibyte-months Get RHSM graph data
 * @apiDescription Retrieve graph data.
 *
 * @apiSuccessExample {json} DAILY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2020-07-01T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-02T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-03T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-04T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-05T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-06T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-07T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-08T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-09T00:00:00Z",
 *           "value": 1000,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-10T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-11T00:00:00Z",
 *           "value": 50,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-12T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-13T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-14T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-15T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-16T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-17T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-18T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-19T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-20T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-21T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-22T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-23T00:00:00Z",
 *           "value": 0,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-24T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-25T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-26T00:00:00Z",
 *           "value": 104,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-27T00:00:00Z",
 *           "value": 70,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-28T00:00:00Z",
 *           "value": 82,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-29T00:00:00Z",
 *           "value": 86,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-30T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 144,
 *           "has_data": true
 *         }
 *       ],
 *       "links": {},
 *       "meta": {
 *         "count": 31,
 *         "granularity": "daily",
 *         "has_cloudigrade_data": true,
 *         "has_cloudigrade_mismatch": true,
 *         "metric_id": "Storage-gibibyte-months",
 *         "product": "RHEL",
 *         "service_level": "",
 *         "total_monthly": {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 2048,
 *           "has_data": true
 *         },
 *         "usage": ""
 *       }
 *     }
 */
/**
 * @apiMock {DelayResponse} 250
 * @apiMock {RandomSuccess}
 * @api {get} /api/rhsm-subscriptions/v1/tally/products/:product_id/Instance-hours Get RHSM graph data
 * @apiDescription Retrieve graph data.
 *
 * @apiSuccessExample {json} DAILY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2020-07-01T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-02T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-03T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-04T00:00:00Z",
 *           "value": 25,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-05T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-06T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-07T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-08T00:00:00Z",
 *           "value": 50,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-09T00:00:00Z",
 *           "value": 1000000,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-10T00:00:00Z",
 *           "value": 1000000,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-11T00:00:00Z",
 *           "value": 1000000,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-12T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-13T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-14T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-15T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-16T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-17T00:00:00Z",
 *           "value": null,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-18T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-19T00:00:00Z",
 *           "value": null,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-20T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-21T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-22T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-23T00:00:00Z",
 *           "value": 0,
 *           "has_data": false
 *         },
 *         {
 *           "date": "2020-07-24T00:00:00Z",
 *           "value": 0,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-25T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-26T00:00:00Z",
 *           "value": 104,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-27T00:00:00Z",
 *           "value": 70,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-28T00:00:00Z",
 *           "value": 82,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-29T00:00:00Z",
 *           "value": 86,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-30T00:00:00Z",
 *           "value": 90,
 *           "has_data": true
 *         },
 *         {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 144,
 *           "has_data": true
 *         }
 *       ],
 *       "links": {},
 *       "meta": {
 *         "granularity": "daily",
 *         "has_cloudigrade_data": true,
 *         "has_cloudigrade_mismatch": true,
 *         "metric_id": "Instance-hours",
 *         "product": "RHEL",
 *         "service_level": "",
 *         "total_monthly": {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 2000,
 *           "has_data": true
 *         },
 *         "usage": ""
 *       }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *        "errors": [
 *          {
 *            "code": "SUBSCRIPTIONS1004",
 *            "detail": "Opt-in required.",
 *            "status": "403",
 *            "title": "Access Denied"
 *          }
 *        ]
 *     }
 */
/* Get RHSM API reporting/tally graph/chart data.
 *
 * @param {string|Array} id String ID, or an array of identifiers to update a dotenv url path
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cache
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @param {Array} options.schema An array of callbacks used to transform the response, ie. [SUCCESS SCHEMA, ERROR SCHEMA]
 * @param {Array} options.transform An array of callbacks used to transform the response, ie. [SUCCESS TRANSFORM, ERROR TRANSFORM]
 * @returns {Promise<*>}
 */
const getGraphTally = (id, params = {}, options = {}) => {
  const {
    cache = true,
    cancel = true,
    cancelId,
    schema = [rhsmSchemas.tally, rhsmSchemas.errors],
    transform = [rhsmTransformers.tallyCapacity]
  } = options;
  const updatedId = (typeof id === 'string' && [id]) || (Array.isArray(id) && id) || [];

  let url = `${process.env.REACT_APP_SERVICES_RHSM_TALLY}`;
  updatedId.forEach((value, index) => {
    let updatedValue = value;
    if (index === 0) {
      updatedValue = rhsmHelpers.filterArchitectureVariant(value, params);
    }

    url = url.replace(`{${index}}`, updatedValue);
  });

  return serviceCall({
    url,
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

/**
 * @api {get} /api/rhsm-subscriptions/v1/capacity/products/:product_id/:metric_id Get RHSM graph capacity data, i.e. thresholds
 * @apiDescription Retrieve graph capacity data, such as thresholds.
 *
 * Reference [RHSM for capacity params and commands](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2020-07-01T00:00:00Z",
 *           "value": 0,
 *           "has_data": true,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-02T00:00:00Z",
 *           "value": 0,
 *           "has_data": true,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-03T00:00:00Z",
 *           "value": 0,
 *           "has_data": true,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-04T00:00:00Z",
 *           "value": 25,
 *           "has_data": true,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-05T00:00:00Z",
 *           "value": 50,
 *           "has_data": false,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-06T00:00:00Z",
 *           "value": 0,
 *           "has_data": true,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-07T00:00:00Z",
 *           "value": 0,
 *           "has_data": false,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-08T00:00:00Z",
 *           "value": 0,
 *           "has_data": false,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-09T00:00:00Z",
 *           "value": 50,
 *           "has_data": false,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-10T00:00:00Z",
 *           "value": 100,
 *           "has_data": false,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-11T00:00:00Z",
 *           "value": 100,
 *           "has_data": true,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-12T00:00:00Z",
 *           "has_data": null,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-13T00:00:00Z",
 *           "has_data": false,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-14T00:00:00Z",
 *           "value": null,
 *           "has_data": false,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-15T00:00:00Z",
 *           "value": null,
 *           "has_data": false,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-16T00:00:00Z",
 *           "value": null,
 *           "has_data": false,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-17T00:00:00Z",
 *           "value": null,
 *           "has_data": false,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-18T00:00:00Z",
 *           "value": null,
 *           "has_data": true,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-19T00:00:00Z",
 *           "value": null,
 *           "has_data": true,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-20T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-21T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-22T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-23T00:00:00Z",
 *           "value": 200,
 *           "has_data": false,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-24T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-25T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-26T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-27T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-28T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-29T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-30T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-31T00:00:00Z",
 *           "value": 200,
 *           "has_data": true,
 *           "has_infinite_quantity": true
 *         }
 *       ],
 *       "links": {},
 *       "meta": {
 *         "count": 31,
 *         "product": "RHEL",
 *         "metric_id": "Sockets",
 *         "granularity": "daily",
 *         "service_level": "",
 *         "usage": "",
 *         "category": ""
 *       }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Get RHSM API capacity/threshold graph/chart data.
 *
 * @param {string|Array} id String ID, or an array of identifiers to update a dotenv url path
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getGraphCapacity = (id, params = {}, options = {}) => {
  const {
    cache = true,
    cancel = true,
    cancelId,
    schema = [rhsmSchemas.capacity, rhsmSchemas.errors],
    transform = [rhsmTransformers.tallyCapacity]
  } = options;
  const updatedId = (typeof id === 'string' && [id]) || (Array.isArray(id) && id) || [];

  let url = `${process.env.REACT_APP_SERVICES_RHSM_CAPACITY}`;
  updatedId.forEach((value, index) => {
    let updatedValue = value;
    if (index === 0) {
      updatedValue = rhsmHelpers.filterArchitectureVariant(value, params);
    }

    url = url.replace(`{${index}}`, updatedValue);
  });

  return serviceCall({
    url,
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform,
    _isCapacity: true
  });
};

/**
 * @apiMock {DelayResponse} 500
 * @api {get} /api/rhsm-subscriptions/v1/hosts/products/:product_id Get RHSM hosts/systems table/inventory data
 * @apiDescription Retrieve hosts/systems table/inventory data.
 *
 * Reference [RHSM for hosts/system table/inventory](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data" : [
 *         {
 *           "insights_id": "498cff02-8b4b-46f8-a655-123456789012",
 *           "inventory_id": "498cff02-8b4b-46f8-a655-123456789012",
 *           "display_name": "ipsum.example.com",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b122-123456789012",
 *           "cores": 4,
 *           "core_hours": 10.05,
 *           "sockets": 2,
 *           "hardware_type": "VIRTUALIZED",
 *           "measurement_type": "VIRTUAL",
 *           "number_of_guests": 70,
 *           "last_seen": "2020-04-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6N",
 *           "inventory_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6N",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b123-X3bXe4XXfD6N",
 *           "cloud_provider": "AZURE",
 *           "cores": 4,
 *           "core_hours": 10.00,
 *           "sockets": 6,
 *           "hardware_type": "CLOUD",
 *           "measurement_type": "CLOUD",
 *           "number_of_guests": 0,
 *           "last_seen": "2020-06-20T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "498cff02-8b4b-46f8-a655-X3bXe4XXfD6M",
 *           "inventory_id": "498cff02-8b4b-46f8-a655-X3bXe4XXfD6M",
 *           "display_name": "dolor.example.com",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b122-X3bXe4XXfD6M",
 *           "cores": 4,
 *           "core_hours": 1000.20,
 *           "sockets": 2,
 *           "hardware_type": "VIRTUALIZED",
 *           "measurement_type": "VIRTUAL",
 *           "number_of_guests": 10,
 *           "last_seen": "2020-04-02T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "498cff02-8b4b-46f8-a655-X3bXe4XXfD6L",
 *           "inventory_id": "498cff02-8b4b-46f8-a655-X3bXe4XXfD6L",
 *           "display_name": "dolor.again.com",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b122-X3bXe4XXfD6L",
 *           "cores": 4,
 *           "core_hours": 1001.60,
 *           "sockets": 2,
 *           "hardware_type": "VIRTUALIZED",
 *           "measurement_type": "VIRTUAL",
 *           "number_of_guests": 1,
 *           "last_seen": "2020-04-02T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YX",
 *           "inventory_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YX",
 *           "display_name": "lorem.test.com",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b123-X3bXe4XXfD6YX",
 *           "cores": 4,
 *           "core_hours": 999.60,
 *           "sockets": 6,
 *           "hardware_type": "PHYSICAL",
 *           "measurement_type": "HYPERVISOR",
 *           "number_of_guests": 0,
 *           "last_seen": "2020-06-20T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YZ",
 *           "inventory_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YZ",
 *           "display_name": "lorem.again.com",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b123-X3bXe4XXfD6YZ",
 *           "cores": 0,
 *           "core_hours": 0,
 *           "sockets": 6,
 *           "hardware_type": "PHYSICAL",
 *           "measurement_type": "PHYSICAL",
 *           "number_of_guests": 0,
 *           "last_seen": "2020-06-20T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YA",
 *           "inventory_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YA",
 *           "display_name": "lorem.another.com",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b123-X3bXe4XXfD6YA",
 *           "cores": 0,
 *           "core_hours": 0.01,
 *           "sockets": 6,
 *           "hardware_type": "PHYSICAL",
 *           "measurement_type": "PHYSICAL",
 *           "number_of_guests": 0,
 *           "last_seen": "2020-06-21T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YB",
 *           "inventory_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YB",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b123-X3bXe4XXfD6YB",
 *           "cores": 0,
 *           "core_hours": 999.61,
 *           "sockets": 6,
 *           "hardware_type": "PHYSICAL",
 *           "measurement_type": "PHYSICAL",
 *           "number_of_guests": 0,
 *           "last_seen": "2020-06-22T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YC",
 *           "inventory_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YC",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b123-X3bXe4XXfD6YC",
 *           "cores": 3,
 *           "sockets": 1,
 *           "hardware_type": "PHYSICAL",
 *           "measurement_type": "HYPERVISOR",
 *           "number_of_guests": 0,
 *           "last_seen": "2020-06-23T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YD",
 *           "inventory_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YD",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b123-X3bXe4XXfD6YD",
 *           "cores": 3,
 *           "sockets": 1,
 *           "hardware_type": "PHYSICAL",
 *           "measurement_type": "HYPERVISOR",
 *           "number_of_guests": 0,
 *           "last_seen": "2020-06-24T00:00:00Z"
 *         },
 *         {
 *            "insights_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YEE",
 *           "inventory_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YEE",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b123-X3bXe4XXfD6YEE",
 *           "cores": 3,
 *           "sockets": 0,
 *           "hardware_type": "PHYSICAL",
 *           "measurement_type": "HYPERVISOR",
 *           "number_of_guests": 0,
 *           "last_seen": "2020-06-26T00:00:00Z"
 *         },
 *         {
 *            "insights_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YF",
 *           "inventory_id": "499cff02-8b4b-46f8-a6xx-X3bXe4XXfD6YF",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b123-X3bXe4XXfD6YF",
 *           "cores": 3,
 *           "sockets": 0,
 *           "hardware_type": "PHYSICAL",
 *           "measurement_type": "HYPERVISOR",
 *           "number_of_guests": 0,
 *           "last_seen": "2020-06-29T00:00:00Z"
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/hosts/RHEL?granularity=DAILY&sla=Premium&usage=Production&offset=0&limit=5",
 *         "last": "/api/rhsm-subscriptions/v1/hosts/RHEL?granularity=DAILY&sla=Premium&usage=Production&offset=5&limit=5",
 *         "previous": null,
 *         "next": "/api/rhsm-subscriptions/v1/hosts/RHEL?granularity=DAILY&sla=Premium&usage=Production&offset=5&limit=5"
 *       },
 *       "meta": {
 *         "count": 11
 *       }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Get RHSM API hosts table/inventory data.
 *
 * @deprecated The Hosts inventory response is being replaced in favor of the Instances inventory response.
 * @param {string} id Product ID
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getHostsInventory = (id, params = {}, options = {}) => {
  const {
    cache = true,
    cancel = true,
    cancelId,
    schema = [rhsmSchemas.hosts, rhsmSchemas.errors],
    transform = [rhsmTransformers.hosts]
  } = options;
  const updatedId = rhsmHelpers.filterArchitectureVariant(id, params);
  return serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_INVENTORY}${updatedId}`,
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

/**
 * @apiMock {DelayResponse} 250
 * @api {get} /api/rhsm-subscriptions/v1/hosts/:hypervisor_uuid/guests Get RHSM hosts/systems table/inventory guests data
 * @apiDescription Retrieve hosts/systems table/inventory guests data.
 *
 * Reference [RHSM for hosts/system table/inventory](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data" : [
 *         {
 *           "insights_id": "d6214a0b-b344-4778-831c-d53dcacb2da3",
 *           "inventory_id": "d6214a0b-b344-4778-831c-d53dcacb2da3",
 *           "display_name": "guest01.example.com",
 *           "subscription_manager_id": "adafd9d5-5b00-42fa-a6c9-75801d45cc6d",
 *           "last_seen": "2020-04-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-dcef6e970852",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-dcef6e970852",
 *           "display_name": "guest02.example.com",
 *           "subscription_manager_id": "b101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest03.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "498cff02-8b4b-46f8-a655-XLef312123456",
 *           "inventory_id": "498cff02-8b4b-46f8-a655-XLef312123456",
 *           "display_name": "guest04.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest05.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest06.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest07.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest08.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest09.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest10.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/hosts/a283ffb6-e0f3-4dbe-9732-ccfdb297ba07/guests?offset=0&limit=5",
 *         "last": "/api/rhsm-subscriptions/v1/hosts/a283ffb6-e0f3-4dbe-9732-ccfdb297ba07/guests?offset=5&limit=5",
 *         "previous": null,
 *         "next": "/api/rhsm-subscriptions/v1/hosts/a283ffb6-e0f3-4dbe-9732-ccfdb297ba07/guests?offset=5&limit=5"
 *       },
 *       "meta": {
 *         "count": 70
 *       }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Get RHSM API hosts table/inventory guests data.
 *
 * @deprecated The Hosts inventory guest response is being replaced in favor of the Instances inventory guest response.
 * @param {string} id Subscription Manager ID
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cache
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @param {Array} options.schema An array of callbacks used to transform the response, ie. [SUCCESS SCHEMA, ERROR SCHEMA]
 * @param {Array} options.transform An array of callbacks used to transform the response, ie. [SUCCESS TRANSFORM, ERROR TRANSFORM]
 * @returns {Promise<*>}
 */
const getHostsInventoryGuests = (id, params = {}, options = {}) => {
  const {
    cache = true,
    cancel = false,
    cancelId,
    schema = [rhsmSchemas.guests, rhsmSchemas.errors],
    transform = []
  } = options;
  const updatedId = rhsmHelpers.filterArchitectureVariant(id, params);
  return serviceCall({
    url: process.env.REACT_APP_SERVICES_RHSM_INVENTORY_GUESTS.replace('{0}', updatedId),
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

/**
 * @apiMock {DelayResponse} 250
 * @api {get} /api/rhsm-subscriptions/v1/instances/:instance_id/guests Get RHSM instances/systems table/inventory guests data
 * @apiDescription Retrieve instances/systems table/inventory guests data.
 *
 * Reference [RHSM for instances guests](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data" : [
 *         {
 *           "insights_id": "d6214a0b-b344-4778-831c-d53dcacb2da3",
 *           "inventory_id": "d6214a0b-b344-4778-831c-d53dcacb2da3",
 *           "display_name": "guest01.example.com",
 *           "subscription_manager_id": "adafd9d5-5b00-42fa-a6c9-75801d45cc6d",
 *           "last_seen": "2020-04-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-dcef6e970852",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-dcef6e970852",
 *           "display_name": "guest02.example.com",
 *           "subscription_manager_id": "b101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest03.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "498cff02-8b4b-46f8-a655-XLef312123456",
 *           "inventory_id": "498cff02-8b4b-46f8-a655-XLef312123456",
 *           "display_name": "guest04.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest05.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest06.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest07.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest08.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest09.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "inventory_id": "9358e312-1c9f-42f4-8910-XLef312123456",
 *           "display_name": "guest10.example.com",
 *           "subscription_manager_id": "c101a72f-1859-4489-acb8-d6d31c2578c4",
 *           "last_seen": "2020-07-01T00:00:00Z"
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/instances/a283ffb6-e0f3-4dbe-9732-ccfdb297ba07/guests?offset=0&limit=5",
 *         "last": "/api/rhsm-subscriptions/v1/instances/a283ffb6-e0f3-4dbe-9732-ccfdb297ba07/guests?offset=5&limit=5",
 *         "previous": null,
 *         "next": "/api/rhsm-subscriptions/v1/instances/a283ffb6-e0f3-4dbe-9732-ccfdb297ba07/guests?offset=5&limit=5"
 *       },
 *       "meta": {
 *         "count": 70
 *       }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Get RHSM API instances table/inventory guests data.
 *
 * @param {string} id Instance ID
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cache
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @param {Array} options.schema An array of callbacks used to transform the response, ie. [SUCCESS SCHEMA, ERROR SCHEMA]
 * @param {Array} options.transform An array of callbacks used to transform the response, ie. [SUCCESS TRANSFORM, ERROR TRANSFORM]
 * @returns {Promise<*>}
 */
const getInstancesInventoryGuests = (id, params = {}, options = {}) => {
  const {
    cache = true,
    cancel = false,
    cancelId,
    schema = [rhsmSchemas.guests, rhsmSchemas.errors],
    transform = []
  } = options;
  const updatedId = rhsmHelpers.filterArchitectureVariant(id, params);
  return serviceCall({
    url: process.env.REACT_APP_SERVICES_RHSM_INVENTORY_INSTANCES_GUESTS.replace('{0}', updatedId),
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

/**
 * @apiMock {DelayResponse} 750
 * @api {get} /api/rhsm-subscriptions/v1/instances/products/:product_id Get RHSM instances table/inventory data
 * @apiDescription Retrieve instances table/inventory data.
 *
 * Reference [RHSM for instances table/inventory](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data" : [
 *         {
 *           "category": "physical",
 *           "billing_account_id": "xxxxx-xxxx-CCCCC-xxxx-xxxx10",
 *           "instance_id": "CCCCC-b344-4778-831c-CCCCCCC",
 *           "subscription_manager_id": "CCCCC-5b00-42fa-CCCCC-75801d45cc6d",
 *           "display_name": "lorem.example.com",
 *           "measurements": [
 *              200,
 *              10,
 *              500.0000345678,
 *              200
 *           ],
 *           "last_seen": "2022-12-03T00:00:00Z"
 *         },
 *         {
 *           "category": "virtual",
 *           "billing_account_id": "xxxxx-xxxx-FFFFF-xxxx-xxxx40",
 *           "instance_id": "FFFFF-b344-4778-831c-FFFFF",
 *           "subscription_manager_id": "FFFFF-5b00-42fa-FFFFF-75801d45cc6d",
 *           "display_name": "lorem.example.com",
 *           "measurements": [
 *              200,
 *              10,
 *              500.0000345678,
 *              200
 *           ],
 *           "last_seen": "2022-10-03T00:00:00Z"
 *         },
 *         {
 *           "number_of_guests": 70,
 *           "category": "cloud",
 *           "billing_provider": "red hat",
 *           "billing_account_id": "xxxxx-xxxx-xxxx-xxxx-xxxx01",
 *           "instance_id": "d6214a0b-b344-4778-831c-d53dcacb2da3",
 *           "subscription_manager_id": "adafd9d5-5b00-42fa-a6c9-75801d45cc6d",
 *           "display_name": "rhv.example.com",
 *           "measurements": [
 *              42,
 *              10,
 *              0.000003563,
 *              1
 *           ],
 *           "last_seen": "2022-04-01T00:00:00Z"
 *         },
 *         {
 *           "category": "cloud",
 *           "billing_provider": "azure",
 *           "billing_account_id": "xxxxx-xxxx-xxxx-xxxx-xxxx02",
 *           "instance_id": "XXXXXX-b344-4778-831c-XXXXXXXX",
 *           "subscription_manager_id": "XXXXXX-5b00-42fa-XXXX-75801d45cc6d",
 *           "display_name": "dolor.example.com",
 *           "measurements": [
 *              20,
 *              100,
 *              null,
 *              1000
 *           ],
 *           "last_seen": "2022-04-02T00:00:00Z"
 *         },
 *         {
 *           "category": "physical",
 *           "billing_account_id": "xxxxx-xxxx-xxxx-xxxx-xxxx03",
 *           "instance_id": "BBBBB-b344-4778-831c-BBBBBBB",
 *           "subscription_manager_id": "BBBBB-5b00-42fa-BBBBB-75801d45cc6d",
 *           "display_name": "lorem.example.com",
 *           "measurements": [
 *              4000,
 *              50,
 *              10000.0000345678,
 *              3000
 *           ],
 *           "last_seen": "2022-04-03T00:00:00Z"
 *         }
 *       ],
 *       "links": {},
 *       "meta": {
 *         "count": 5,
 *         "measurements": [
 *           "Instance-hours",
 *           "Sockets",
 *           "Storage-gibibyte-months",
 *           "Transfer-gibibytes"
 *         ],
 *         "product": "RHEL",
 *         "service_level": "Premium",
 *         "usage": "Production"
 *       }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Get RHSM API instances data.
 *
 * @param {string} id Product ID
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cache
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @param {Array} options.schema An array of callbacks used to transform the response, ie. [SUCCESS SCHEMA, ERROR SCHEMA]
 * @param {Array} options.transform An array of callbacks used to transform the response, ie. [SUCCESS TRANSFORM, ERROR TRANSFORM]
 * @returns {Promise<*>}
 */
const getInstancesInventory = (id, params = {}, options = {}) => {
  const {
    cache = true,
    cancel = true,
    cancelId,
    schema = [rhsmSchemas.instances, rhsmSchemas.errors],
    transform = [rhsmTransformers.instances]
  } = options;
  const updatedId = rhsmHelpers.filterArchitectureVariant(id, params);
  return serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_INVENTORY_INSTANCES}${updatedId}`,
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

/**
 * @apiMock {DelayResponse} 0
 * @api {get} /api/rhsm-subscriptions/v1/subscriptions/products/:product_id Get RHSM subscriptions table/inventory data
 * @apiDescription Retrieve subscriptions table/inventory data.
 *
 * Reference [RHSM for subscriptions table/inventory](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data" : [
 *         {
 *           "sku": "RH00011",
 *           "product_name": "Red Hat Enterprise Linux Server, Premium (Physical and 4 Virtual Nodes)(L3 Only)",
 *           "billing_provider": "red hat",
 *           "service_level": "Premium",
 *           "usage": "Production",
 *           "subscriptions": [
 *              { "id": "1234567890", "number": "1234567890" },
 *              { "id": "ipsum", "number": "1234567890" },
 *              { "id": "lorem", "number": "1234567890" }
 *           ],
 *           "next_event_date": "2020-04-01T00:00:00Z",
 *           "next_event_type": "Subscription Begin",
 *           "quantity": 1,
 *           "physical_capacity": 1,
 *           "virtual_capacity": 1,
 *           "total_capacity": 2,
 *           "uom": "Sockets",
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "sku": "RH00010",
 *           "product_name": "Red Hat Enterprise Linux Server",
 *           "billing_provider": "azure",
 *           "service_level": "Self-Support",
 *           "usage": "Production",
 *           "subscriptions": [],
 *           "next_event_date": "2020-04-02T00:00:00Z",
 *           "next_event_type": "Subscription Begin",
 *           "quantity": 15,
 *           "physical_capacity": 1,
 *           "virtual_capacity": 1,
 *           "total_capacity": 2,
 *           "uom": "Sockets",
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "sku": "RH00009",
 *           "product_name": "Red Hat Enterprise Linux Server, Premium",
 *           "billing_provider": "Unknown",
 *           "service_level": "Premium",
 *           "usage": "Production",
 *           "subscriptions": [
 *              { "id": "1234567890", "number": "1234567890" }
 *           ],
 *           "next_event_date": "2020-04-01T00:00:00Z",
 *           "next_event_type": "Subscription End",
 *           "quantity": 3000,
 *           "physical_capacity": 2,
 *           "virtual_capacity": 2,
 *           "total_capacity": 4,
 *           "uom": "Cores",
 *           "has_infinite_quantity": false
 *         }
 *       ],
 *       "links": {},
 *       "meta": {
 *         "count": 3,
 *         "subscription_type": "On-demand"
 *       }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Get RHSM API subscriptions data.
 *
 * @param {string} id Product ID
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cache
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @param {Array} options.schema An array of callbacks used to transform the response, ie. [SUCCESS SCHEMA, ERROR SCHEMA]
 * @param {Array} options.transform An array of callbacks used to transform the response, ie. [SUCCESS TRANSFORM, ERROR TRANSFORM]
 * @returns {Promise<*>}
 */
const getSubscriptionsInventory = (id, params = {}, options = {}) => {
  const {
    cache = true,
    cancel = true,
    cancelId,
    schema = [rhsmSchemas.subscriptions, rhsmSchemas.errors],
    transform = []
  } = options;
  const updatedId = rhsmHelpers.filterArchitectureVariant(id, params);
  return serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_INVENTORY_SUBSCRIPTIONS}${updatedId}`,
    params,
    cache,
    cancel,
    cancelId,
    schema,
    transform
  });
};

const rhsmServices = {
  getApiVersion,
  getGraphCapacity,
  getGraphReports,
  getGraphTally,
  getHostsInventory,
  getHostsInventoryGuests,
  getInstancesInventory,
  getInstancesInventoryGuests,
  getSubscriptionsInventory
};

/**
 * Expose services to the browser's developer console.
 */
helpers.browserExpose({ rhsmServices });

export {
  rhsmServices as default,
  rhsmServices,
  getApiVersion,
  getGraphCapacity,
  getGraphReports,
  getGraphTally,
  getHostsInventory,
  getHostsInventoryGuests,
  getInstancesInventory,
  getInstancesInventoryGuests,
  getSubscriptionsInventory
};
