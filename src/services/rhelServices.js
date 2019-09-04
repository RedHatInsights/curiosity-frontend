import axios from 'axios';
import serviceConfig from './config';

/**
 * @apiMock {DelayResponse} 2000
 * @apiMock {ForceStatus} 200
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
 *           "date": "2019-07-20T00:00:00Z",
 *           "instance_count": 10,
 *           "cores": 20,
 *           "sockets": 20,
 *           "sockets_threshold": 30
 *         },
 *         {
 *           "date": "2019-07-21T00:00:00Z",
 *           "instance_count": 12,
 *           "cores": 24,
 *           "sockets": 24,
 *           "sockets_threshold": 30
 *         },
 *         {
 *           "date": "2019-07-22T00:00:00Z",
 *           "instance_count": 14,
 *           "cores": 28,
 *           "sockets": 28,
 *           "sockets_threshold": 0
 *         },
 *         {
 *           "date": "2019-07-23T00:00:00Z",
 *           "instance_count": 16,
 *           "cores": 32,
 *           "sockets": 32,
 *           "sockets_threshold": 0
 *         },
 *         {
 *           "date": "2019-07-24T00:00:00Z",
 *           "instance_count": 18,
 *           "cores": 36,
 *           "sockets": 36,
 *           "sockets_threshold": 50
 *         },
 *         {
 *           "date": "2019-07-25T00:00:00Z",
 *           "instance_count": 20,
 *           "cores": 40,
 *           "sockets": 40,
 *           "sockets_threshold": 50
 *         },
 *         {
 *           "date": "2019-07-26T00:00:00Z",
 *           "instance_count": 22,
 *           "cores": 44,
 *           "sockets": 44,
 *           "sockets_threshold": 50
 *         },
 *         {
 *           "date": "2019-07-27T00:00:00Z",
 *           "instance_count": 24,
 *           "cores": 48,
 *           "sockets": 48,
 *           "sockets_threshold": 50
 *         },
 *         {
 *           "date": "2019-07-28T00:00:00Z",
 *           "instance_count": 26,
 *           "cores": 52,
 *           "sockets": 52,
 *           "sockets_threshold": 50
 *         },
 *         {
 *           "date": "2019-07-29T00:00:00Z",
 *           "instance_count": 28,
 *           "cores": 56,
 *           "sockets": 56,
 *           "sockets_threshold": 50
 *         },
 *         {
 *           "date": "2019-07-30T00:00:00Z",
 *           "instance_count": 30,
 *           "cores": 60,
 *           "sockets": 60,
 *           "sockets_threshold": 70
 *         },
 *         {
 *           "date": "2019-07-31T00:00:00Z",
 *           "instance_count": 32,
 *           "cores": 64,
 *           "sockets": 64,
 *           "sockets_threshold": 70
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
 *     HTTP/1.1 201 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2019-05-26T00:00:00Z",
 *           "instance_count": 16,
 *           "cores": 32,
 *           "sockets": 32
 *         },
 *         {
 *           "date": "2019-06-02T00:00:00Z",
 *           "instance_count": 6,
 *           "cores": 12,
 *           "sockets": 12
 *         },
 *         {
 *           "date": "2019-06-09T00:00:00Z",
 *           "instance_count": 6,
 *           "cores": 12,
 *           "sockets": 12
 *         },
 *         {
 *           "date": "2019-06-16T00:00:00Z",
 *           "instance_count": 6,
 *           "cores": 12,
 *           "sockets": 12
 *         },
 *         {
 *           "date": "2019-06-23T00:00:00Z",
 *           "instance_count": 6,
 *           "cores": 12,
 *           "sockets": 12
 *         },
 *         {
 *           "date": "2019-06-30T00:00:00Z",
 *           "instance_count": 6,
 *           "cores": 12,
 *           "sockets": 12
 *         },
 *         {
 *           "date": "2019-07-07T00:00:00Z",
 *           "instance_count": 5,
 *           "cores": 10,
 *           "sockets": 10
 *         },
 *         {
 *           "date": "2019-07-14T00:00:00Z",
 *           "instance_count": 5,
 *           "cores": 10,
 *           "sockets": 10
 *         },
 *         {
 *           "date": "2019-07-21T00:00:00Z",
 *           "instance_count": 5,
 *           "cores": 10,
 *           "sockets": 10
 *         },
 *         {
 *           "date": "2019-07-28T00:00:00Z",
 *           "instance_count": 6,
 *           "cores": 12,
 *           "sockets": 12
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
 *     HTTP/1.1 201 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2019-01-01T00:00:00Z",
 *           "instance_count": 16,
 *           "cores": 32,
 *           "sockets": 32
 *         },
 *         {
 *           "date": "2019-02-01T00:00:00Z",
 *           "instance_count": 8,
 *           "cores": 16,
 *           "sockets": 16
 *         },
 *         {
 *           "date": "2019-03-01T00:00:00Z",
 *           "instance_count": 0,
 *           "cores": 0,
 *           "sockets": 0
 *         },
 *         {
 *           "date": "2019-04-01T00:00:00Z",
 *           "instance_count": 8,
 *           "cores": 16,
 *           "sockets": 16
 *         },
 *         {
 *           "date": "2019-05-01T00:00:00Z",
 *           "instance_count": 16,
 *           "cores": 32,
 *           "sockets": 32
 *         },
 *         {
 *           "date": "2019-06-01T00:00:00Z",
 *           "instance_count": 24,
 *           "cores": 48,
 *           "sockets": 48
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
 * @apiSuccessExample {json} QUARTERLY, Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *       "data": [
 *         {
 *           "date": "2018-01-01T00:00:00Z",
 *           "instance_count": 24,
 *           "cores": 48,
 *           "sockets": 48
 *         },
 *         {
 *           "date": "2018-04-01T00:00:00Z",
 *           "instance_count": 16,
 *           "cores": 32,
 *           "sockets": 32
 *         },
 *         {
 *           "date": "2018-07-01T00:00:00Z",
 *           "instance_count": 8,
 *           "cores": 16,
 *           "sockets": 16
 *         },
 *         {
 *           "date": "2018-10-01T00:00:00Z",
 *           "instance_count": 0,
 *           "cores": 0,
 *           "sockets": 0
 *         }
 *       ],
 *       "links": {
 *         "first": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=quarterly&beginning=2015-01-01T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0",
 *         "last": "/api/rhsm-subscriptions/v1/tally/products/RHEL?granularity=quarterly&beginning=2015-01-01T00:00:00.000Z&ending=2019-08-19T23:59:59.999Z&offset=0"
 *       },
 *       "meta": {
 *         "count": 4,
 *         "product": "RHEL",
 *         "granularity": "quarterly"
 *       }
 *     }
 *
 * @apiError {String} detail
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
 * @apiError {String} detail
 * @apiErrorExample {text} Error-Response:
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
 * @apiError {String} detail
 * @apiErrorExample {text} Error-Response:
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
const getGraphReportsRhsm = (params = {}) =>
  axios(
    serviceConfig({
      url: process.env.REACT_APP_SERVICES_RHSM_REPORT_RHEL,
      params
    })
  );

const rhelServices = { getGraphReportsRhsm };

export { rhelServices as default, rhelServices, getGraphReportsRhsm };
