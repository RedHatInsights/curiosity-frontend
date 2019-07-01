import axios from 'axios';
import serviceConfig from './config';

/**
 * @apiMock {DelayResponse} 2000
 * @api {get} /api/cloudigrade/v2/concurrent/ Get Cloud Meter graph data
 * @apiDescription Retrieve Cloud Meter graph data.
 *
 * Reference [cloudigrade for report params and commands](https://gitlab.com/cloudigrade/cloudigrade/blob/master/docs/rest-api-examples.rst)
 * Reference [cloudigrade, accessing the APIs](https://gitlab.com/cloudigrade/cloudigrade/wikis/how-do-i-reach-these-apis)
 *
 * @apiParam (Query string) {Mixed} [limit] Limit the number of results
 * @apiParam (Query string) {Mixed} [offset]
 * @apiParam (Query string) {Date} [start_date] Start date in ISO format
 * @apiParam (Query string) {Date} [end_date] End date in ISO format
 *
 * @apiSuccess {Array} data
 * @apiSuccess {Object} links
 * @apiSuccess {Object} meta
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *          {
 *            "date": "2019-05-01",
 *            "instances": 0,
 *            "memory": 0.0,
 *            "vcpu": 0.0
 *          },
 *          {
 *            "date": "2019-05-02",
 *            "instances": 0,
 *            "memory": 0.0,
 *            "vcpu": 0.0
 *          },
 *          {
 *            "date": "2019-05-03",
 *            "instances": 0,
 *            "memory": 0.0,
 *            "vcpu": 0.0
 *          },
 *          {
 *            "date": "2019-05-04",
 *            "instances": 0,
 *            "memory": 0.0,
 *            "vcpu": 0.0
 *          }
 *        ],
 *        "links": {
 *          "first": "/api/cloudigrade/v2/concurrent/?end_date=2019-05-05&limit=10&offset=0&start_date=2019-05-01",
 *          "last": "/api/cloudigrade/v2/concurrent/?end_date=2019-05-05&limit=10&offset=0&start_date=2019-05-01",
 *          "next": null,
 *          "previous": null
 *        },
 *        "meta": {
 *          "count": 4
 *        }
 *     }
 *
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "detail": "Authentication credentials were not provided."
 *     }
 * @apiError {String} detail
 * @apiErrorExample {text} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "detail": "Failed because of {reasons}"
 *     }
 */
const getGraphReportsCm = (params = {}) =>
  axios(
    serviceConfig({
      url: process.env.REACT_APP_SERVICES_CLOUDMETER_REPORT_RHEL,
      params
    })
  );

/**
 * @apiMock {DelayResponse} 2000
 * @api {get} /api/rhsm-subscriptions/v1/tally/accounts/:ACCOUNT_ID/products/RHEL Get RHSM graph data
 * @apiDescription Retrieve graph data.
 *
 * Reference [RHSM for report params and commands](https://github.com/RedHatInsights/rhsm-subscriptions/blob/master/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiParam (Query string) {Enum} granularity The level of granularity to return.
 * - DAILY
 * - WEEKLY
 * - MONTHLY
 * - QUARTERLY
 * - YEARLY
 * @apiParam (Query string) {Date} [beginning] Defines the start of the report period. Dates should be provided in ISO 8601 format but the only accepted offset is UTC. E.g. 2017-07-21T17:32:28Z
 * @apiParam (Query string) {Date} [ending] Defines the end of the report period. Defaults to the current time. Dates should be provided in UTC.
 *
 * @apiSuccess {Enum} granularity
 * - DAILY
 * - WEEKLY
 * - MONTHLY
 * - QUARTERLY
 * - YEARLY
 * @apiSuccess {Enum} product
 * - RHEL
 * @apiSuccess {Array} tally_snapshots
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "granularity": "DAILY",
 *       "product": "RHEL",
 *       "tally_snapshots": [
 *          {
 *            "cores": 56,
 *            "date": "2019-01-01T00:00:00Z",
 *            "instance_count": 28
 *          },
 *          {
 *            "cores": 52,
 *            "date": "2019-01-02T00:00:00Z",
 *            "instance_count": 26
 *          },
 *          {
 *            "cores": 48,
 *            "date": "2019-01-03T00:00:00Z",
 *            "instance_count": 24
 *          },
 *          {
 *            "cores": 44,
 *            "date": "2019-01-04T00:00:00Z",
 *            "instance_count": 22
 *          },
 *          {
 *            "cores": 40,
 *            "date": "2019-01-05T00:00:00Z",
 *            "instance_count": 20
 *          }
 *        ]
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
const getGraphReportsRhsm = (accountId, params = {}) =>
  axios(
    serviceConfig({
      url: `${process.env.REACT_APP_SERVICES_RHSM_REPORT_RHEL.replace('{0}', accountId)}`,
      params
    })
  );

const rhelServices = { getGraphReportsCm, getGraphReportsRhsm };

export { rhelServices as default, rhelServices, getGraphReportsCm, getGraphReportsRhsm };
