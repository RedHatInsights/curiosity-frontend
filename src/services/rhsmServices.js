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
 * @returns {Promise<*>}
 */
const getApiVersion = () =>
  serviceCall({
    url: process.env.REACT_APP_SERVICES_RHSM_VERSION,
    cancel: true
  });

/**
 * @apiMock {DelayResponse} 2000
 * @apiMock {RandomSuccess}
 * @api {get} /api/rhsm-subscriptions/v1/tally/products/:product_id Get RHSM graph data
 * @apiDescription Retrieve graph data.
 *
 * Reference [RHSM for report params and commands](https://github.com/RedHatInsights/rhsm-subscriptions/blob/master/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiParam {Enum} product_id The ID for the product we wish to query.
 * - RHEL
 *
 * @apiParam (Query string) {Enum} granularity The level of granularity to return.
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
 * @apiSuccess {Object} links
 * @apiSuccess {Object} meta
 * @apiSuccess {Enum} meta.granularity
 * - DAILY
 * - WEEKLY
 * - MONTHLY
 * - QUARTERLY
 * - YEARLY
 * @apiSuccess {Enum} meta.product
 * - RHEL
 * @apiSuccess {Number} meta.resultSetSize
 *
 * @apiSuccessExample {json} DAILY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2019-07-01T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 80
 *         },
 *         {
 *           "date": "2019-07-02T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 80
 *         },
 *         {
 *           "date": "2019-07-03T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 80
 *         },
 *         {
 *           "date": "2019-07-04T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 80
 *         },
 *         {
 *           "date": "2019-07-05T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-06T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-07T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-08T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-09T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-10T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-11T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-12T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-13T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-14T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-15T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-16T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-17T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-18T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-19T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-20T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-21T00:00:00Z",
 *           "sockets": 24,
 *           "physical_sockets": 24,
 *           "hypervisor_sockets": 0,
 *           "has_data": true,
 *           "cloud_sockets": 20
 *         },
 *         {
 *           "date": "2019-07-22T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2019-07-23T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_data": false,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2019-07-24T00:00:00Z",
 *           "sockets": 76,
 *           "physical_sockets": 36,
 *           "hypervisor_sockets": 40,
 *           "has_data": true,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2019-07-25T00:00:00Z",
 *           "sockets": 90,
 *           "physical_sockets": 40,
 *           "hypervisor_sockets": 50,
 *           "has_data": true,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2019-07-26T00:00:00Z",
 *           "sockets": 104,
 *           "physical_sockets": 44,
 *           "hypervisor_sockets": 60,
 *           "has_data": true,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2019-07-27T00:00:00Z",
 *           "sockets": 78,
 *           "physical_sockets": 48,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2019-07-28T00:00:00Z",
 *           "sockets": 82,
 *           "physical_sockets": 52,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2019-07-29T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-07-30T00:00:00Z",
 *           "sockets": 90,
 *           "physical_sockets": 60,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 40
 *         },
 *         {
 *           "date": "2019-07-31T00:00:00Z",
 *           "sockets": 144,
 *           "physical_sockets": 64,
 *           "hypervisor_sockets": 80,
 *           "has_data": true,
 *           "cloud_sockets": 40
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=daily&beginning=2019-07-20T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0",
 *         "last": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=daily&beginning=2019-07-20T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0"
 *       },
 *       "meta": {
 *         "count": 12,
 *         "product": "RHEL",
 *         "granularity": "daily"
 *       }
 *     }
 *
 * @apiSuccessExample {json} WEEKLY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2019-05-19T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-05-26T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-06-02T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-06-09T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-06-16T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-06-23T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-06-30T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-07-07T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-07-14T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-07-21T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-07-28T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         },
 *         {
 *           "date": "2019-08-04T00:00:00Z",
 *           "sockets": 86,
 *           "physical_sockets": 56,
 *           "hypervisor_sockets": 30,
 *           "has_data": true,
 *           "cloud_sockets": 60
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=weekly&beginning=2019-05-26T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0",
 *         "last": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=weekly&beginning=2019-05-26T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0"
 *       },
 *       "meta": {
 *         "count": 10,
 *         "product": "RHEL",
 *         "granularity": "weekly"
 *       }
 *     }
 *
 * @apiSuccessExample {json} MONTHLY, Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2018-08-01T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 25,
 *           "hypervisor_sockets": 50,
 *           "has_data": true,
 *           "cloud_sockets": 25
 *         },
 *         {
 *           "date": "2018-09-01T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 25,
 *           "hypervisor_sockets": 50,
 *           "has_data": true,
 *           "cloud_sockets": 25
 *         },
 *         {
 *           "date": "2018-10-01T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 25,
 *           "hypervisor_sockets": 50,
 *           "has_data": true,
 *           "cloud_sockets": 25
 *         },
 *         {
 *           "date": "2018-11-01T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": null,
 *           "has_data": false,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2018-12-01T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": null,
 *           "has_data": false,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2019-01-01T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": null,
 *           "has_data": false,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2019-02-01T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": null,
 *           "has_data": false,
 *           "cloud_sockets": 0
 *         },
 *         {
 *           "date": "2019-03-01T00:00:00Z",
 *           "sockets": 3000,
 *           "physical_sockets": 500,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         },
 *         {
 *           "date": "2019-04-01T00:00:00Z",
 *           "sockets": 2600,
 *           "physical_sockets": 100,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         },
 *         {
 *           "date": "2019-05-01T00:00:00Z",
 *           "sockets": 3000,
 *           "physical_sockets": 500,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         },
 *         {
 *           "date": "2019-06-01T00:00:00Z",
 *           "sockets": 3000,
 *           "physical_sockets": 500,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         },
 *         {
 *           "date": "2019-07-01T00:00:00Z",
 *           "sockets": 3000,
 *           "physical_sockets": 500,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         },
 *         {
 *           "date": "2019-08-01T00:00:00Z",
 *           "sockets": 2600,
 *           "physical_sockets": 100,
 *           "hypervisor_sockets": 2000,
 *           "has_data": true,
 *           "cloud_sockets": 500
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=monthly&beginning=2018-08-01T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0",
 *         "last": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=monthly&beginning=2018-08-01T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0"
 *       },
 *       "meta": {
 *         "count": 6,
 *         "product": "RHEL",
 *         "granularity": "monthly"
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
 * @returns {Promise<*>}
 */
const getGraphReports = (id, params = {}) =>
  serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_REPORT}${id}`,
    params,
    cancel: true
  });

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
 *           "date": "2019-07-01T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-02T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-03T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-04T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-05T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-06T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-07T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-08T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-09T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-10T00:00:00Z",
 *           "sockets": 0,
 *           "physical_sockets": 0,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-11T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-12T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-13T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-14T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-15T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-16T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-17T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-18T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-18T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-19T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 50,
 *           "hypervisor_sockets": 0,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-20T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 32,
 *           "hypervisor_sockets": 18,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-21T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 32,
 *           "hypervisor_sockets": 18,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-22T00:00:00Z",
 *           "sockets": 50,
 *           "physical_sockets": 32,
 *           "hypervisor_sockets": 18,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-23T00:00:00Z",
 *           "sockets": null,
 *           "physical_sockets": null,
 *           "hypervisor_sockets": null,
 *           "has_infinite_quantity": false
 *         },
 *         {
 *           "date": "2019-07-24T00:00:00Z",
 *           "sockets": null,
 *           "physical_sockets": null,
 *           "hypervisor_sockets": null,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-25T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-26T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-27T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-28T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-29T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-30T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         },
 *         {
 *           "date": "2019-07-31T00:00:00Z",
 *           "sockets": 100,
 *           "physical_sockets": 75,
 *           "hypervisor_sockets": 25,
 *           "has_infinite_quantity": true
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/capacity/products/RHEL?granularity=daily&beginning=2019-07-20T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0",
 *         "last": "/api/rhsm-subscriptions/v1/capacity/products/RHEL?granularity=daily&beginning=2019-07-20T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0",
 *         "previous": null,
 *         "next": "/api/rhsm-subscriptions/v1/capacity/products/RHEL?granularity=daily&beginning=2019-07-20T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0"
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
 * @returns {Promise<*>}
 */
const getGraphCapacity = (id, params = {}) =>
  serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_CAPACITY}${id}`,
    params,
    cancel: true
  });

/**
 * @apiMock {DelayResponse} 1000
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
 *           "insights_id": "498cff02-8b4b-46f8-a655-56043XXX0d2f",
 *           "display_name": "ipsum.example.com",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b122-2e65ad8e7d3e",
 *           "cores": 4,
 *           "sockets": 2,
 *           "hardware_type": "physical",
 *           "number_of_guests": 4,
 *           "last_seen": "2020-04-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "499cff02-8b4b-46f8-a6xx-56043FFF0d2e",
 *           "display_name": "lorem.example.com",
 *           "subscription_manager_id": "b6028fa4-cd26-449a-b123-2e25aa8e7d3e",
 *           "cores": 4,
 *           "sockets": 6,
 *           "hardware_type": "physical",
 *           "last_seen": "2020-06-20T00:00:00Z"
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/hosts/RHEL?granularity=DAILY&sla=Premium&usage=Production&offset=0&limit=5",
 *         "last": "/api/rhsm-subscriptions/v1/hosts/RHEL?granularity=DAILY&sla=Premium&usage=Production&offset=5&limit=5",
 *         "previous": null,
 *         "next": "/api/rhsm-subscriptions/v1/hosts/RHEL?granularity=DAILY&sla=Premium&usage=Production&offset=5&limit=5"
 *       },
 *       "meta": {
 *         "count": 2
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
 * @returns {Promise<*>}
 */
const getHostsInventory = (id, params = {}) =>
  serviceCall({
    url: `${process.env.REACT_APP_SERVICES_RHSM_INVENTORY}${id}`,
    params,
    cancel: true
  });

/**
 * @apiMock {DelayResponse} 500
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
 *           "display_name": "guest01.example.com",
 *           "subscription_manager_id": "adafd9d5-5b00-42fa-a6c9-75801d45cc6d",
 *           "last_seen": "2020-04-01T00:00:00Z"
 *         },
 *         {
 *           "insights_id": "9358e312-1c9f-42f4-8910-dcef6e970852",
 *           "display_name": "guest02.example.com",
 *           "subscription_manager_id": "b101a72f-1859-4489-acb8-d6d31c2578c4",
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
 *         "count": 2
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
 * @returns {Promise<*>}
 */
const getHostsInventoryGuests = (id, params = {}) =>
  serviceCall({
    url: process.env.REACT_APP_SERVICES_RHSM_INVENTORY_GUESTS.replace('{0}', id),
    params,
    cancel: true
  });

const rhsmServices = { getApiVersion, getGraphCapacity, getGraphReports, getHostsInventory, getHostsInventoryGuests };

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
  getHostsInventoryGuests
};
