import { serviceCall } from './config';
import { helpers } from '../common';

/**
 * @api {get} /api/rhsm-subscriptions/v1/version
 * @apiDescription Retrieve API version information
 *
 * Reference [RHSM API](https://github.com/RedHatInsights/rhsm-subscriptions/blob/master/api/rhsm-subscriptions-api-spec.yaml)
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
 * Reference [RHSM for report params and commands](https://github.com/RedHatInsights/rhsm-subscriptions/blob/master/api/rhsm-subscriptions-api-spec.yaml)
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
 * @param {string} id Product ID
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getGraphReports = (id, params = {}, options = {}) => {
  const { cache = true, cancel = true, cancelId } = options;
  return serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_REPORT}${id}`,
    params,
    cache,
    cancel,
    cancelId
  });
};

/**
 * @api {get} /api/rhsm-subscriptions/v1/capacity/products/:product_id Get RHSM graph capacity data, i.e. thresholds
 * @apiDescription Retrieve graph capacity data, such as thresholds.
 *
 * Reference [RHSM for capacity params and commands](https://github.com/RedHatInsights/rhsm-subscriptions/blob/master/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2020-07-01T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-02T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-03T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-04T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-05T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-06T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-07T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-08T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-09T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-10T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-11T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-12T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-13T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-14T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-15T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-16T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-17T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-18T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-19T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-20T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 32,
 *           "hypervisor_sockets": 18,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-21T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 32,
 *           "hypervisor_sockets": 18,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-22T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 32,
 *           "hypervisor_sockets": 18,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-23T00:00:00Z",
 *           "sockets": null,
 *           "physical_sockets": null,
 *           "hypervisor_sockets": null,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2020-07-24T00:00:00Z",
 *           "sockets": null,
 *           "physical_sockets": null,
 *           "hypervisor_sockets": null,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-25T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-26T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-27T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-28T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-29T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-30T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2020-07-31T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/capacity/products/RHEL?granularity=daily&beginning=2020-07-20T00:00:00.000Z&ending=2020-08-19T23:59:59.999Z&offset=0",
 *         "last": "/api/rhsm-subscriptions/v1/capacity/products/RHEL?granularity=daily&beginning=2020-07-20T00:00:00.000Z&ending=2020-08-19T23:59:59.999Z&offset=0",
 *         "previous": null,
 *         "next": "/api/rhsm-subscriptions/v1/capacity/products/RHEL?granularity=daily&beginning=2020-07-20T00:00:00.000Z&ending=2020-08-19T23:59:59.999Z&offset=0"
 *       },
 *       "meta": {
 *         "count": 11,
 *         "product": "RHEL",
 *         "granularity": "daily"
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
 * @param {string} id Product ID
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getGraphCapacity = (id, params = {}, options = {}) => {
  const { cache = true, cancel = true, cancelId } = options;
  return serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_CAPACITY}${id}`,
    params,
    cache,
    cancel,
    cancelId
  });
};

/**
 * @apiMock {DelayResponse} 500
 * @api {get} /api/rhsm-subscriptions/v1/hosts/products/:product_id Get RHSM hosts/systems table/inventory data
 * @apiDescription Retrieve hosts/systems table/inventory data.
 *
 * Reference [RHSM for hosts/system table/inventory](https://github.com/RedHatInsights/rhsm-subscriptions/blob/master/api/rhsm-subscriptions-api-spec.yaml)
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
 * @param {string} id Product ID
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getHostsInventory = (id, params = {}, options = {}) => {
  const { cache = true, cancel = true, cancelId } = options;
  return serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_INVENTORY}${id}`,
    params,
    cache,
    cancel,
    cancelId
  });
};

/**
 * @apiMock {DelayResponse} 250
 * @api {get} /api/rhsm-subscriptions/v1/hosts/:hypervisor_uuid/guests Get RHSM hosts/systems table/inventory guests data
 * @apiDescription Retrieve hosts/systems table/inventory guests data.
 *
 * Reference [RHSM for hosts/system table/inventory](https://github.com/RedHatInsights/rhsm-subscriptions/blob/master/api/rhsm-subscriptions-api-spec.yaml)
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
 * @param {string} id Subscription Manager ID
 * @param {object} params Query/search params
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getHostsInventoryGuests = (id, params = {}, options = {}) => {
  const { cache = true, cancel = false, cancelId } = options;
  return serviceCall({
    url: process.env.REACT_APP_SERVICES_RHSM_INVENTORY_GUESTS.replace('{0}', id),
    params,
    cache,
    cancel,
    cancelId
  });
};

/**
 * @apiMock {DelayResponse} 250
 * @api {get} /api/rhsm-subscriptions/v1/subscriptions/products/:product_id Get RHSM subscriptions table/inventory data
 * @apiDescription Retrieve subscriptions table/inventory data.
 *
 * Reference [RHSM for subscriptions table/inventory](https://github.com/RedHatInsights/rhsm-subscriptions/blob/master/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data" : [
 *         {
 *           "sku": "RH00011",
 *           "product_name": "Red Hat Enterprise Linux Server, Premium (Physical and 4 Virtual Nodes)(L3 Only)",
 *           "service_level": "Premium",
 *           "usage": "Production",
 *           "subscription_numbers": ["1234567890", "1234567890", "1234567890"],
 *           "upcoming_event_date": "2020-04-01T00:00:00Z",
 *           "upcoming_event_type": "Subscription Begin",
 *           "physical_capacity": 1,
 *           "virtual_capacity": 1,
 *           "total_capacity": 2,
 *           "uom": "Sockets"
 *         },
 *         {
 *           "sku": "RH00010",
 *           "product_name": "Red Hat Enterprise Linux Server",
 *           "service_level": "Self-Support",
 *           "usage": "Production",
 *           "subscription_numbers": ["1234567890", "1234567890", "1234567890"],
 *           "upcoming_event_date": "2020-04-02T00:00:00Z",
 *           "upcoming_event_type": "Subscription Begin",
 *           "physical_capacity": 1,
 *           "virtual_capacity": 1,
 *           "total_capacity": 2,
 *           "uom": "Sockets"
 *         },
 *         {
 *           "sku": "RH00009",
 *           "product_name": "Red Hat Enterprise Linux Server, Premium",
 *           "service_level": "Premium",
 *           "usage": "Production",
 *           "subscription_numbers": ["1234567890", "1234567890", "1234567890"],
 *           "upcoming_event_date": "2020-04-01T00:00:00Z",
 *           "upcoming_event_type": "Subscription End",
 *           "physical_capacity": 2,
 *           "virtual_capacity": 2,
 *           "total_capacity": 4,
 *           "uom": "Cores"
 *         }
 *       ],
 *       "links": {},
 *       "meta": {
 *         "count": 3
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
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getSubscriptionsInventory = (id, params = {}, options = {}) => {
  const { cache = true, cancel = true, cancelId } = options;
  return serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_INVENTORY_SUBSCRIPTIONS}${id}`,
    params,
    cache,
    cancel,
    cancelId
  });
};

const rhsmServices = {
  getApiVersion,
  getGraphCapacity,
  getGraphReports,
  getHostsInventory,
  getHostsInventoryGuests,
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
  getHostsInventory,
  getHostsInventoryGuests,
  getSubscriptionsInventory
};
