import axios from 'axios';
import serviceConfig from './config';

/**
 * @apiMock {DelayResponse} 2000
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
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [
 *          {
 *            "cores": 56,
 *            "date": "2019-06-01T00:00:00Z",
 *            "instance_count": 28
 *          },
 *          {
 *            "cores": 52,
 *            "date": "2019-06-02T00:00:00Z",
 *            "instance_count": 26
 *          },
 *          {
 *            "cores": 48,
 *            "date": "2019-06-03T00:00:00Z",
 *            "instance_count": 24
 *          },
 *          {
 *            "cores": 44,
 *            "date": "2019-06-04T00:00:00Z",
 *            "instance_count": 22
 *          },
 *          {
 *            "cores": 40,
 *            "date": "2019-06-05T00:00:00Z",
 *            "instance_count": 20
 *          },
 *          {
 *            "cores": 20,
 *            "date": "2019-06-06T00:00:00Z",
 *            "instance_count": 20
 *          },
 *          {
 *            "cores": 80,
 *            "date": "2019-06-07T00:00:00Z",
 *            "instance_count": 40
 *          },
 *          {
 *            "cores": 43,
 *            "date": "2019-06-08T00:00:00Z",
 *            "instance_count": 18
 *          },
 *          {
 *            "cores": 50,
 *            "date": "2019-06-09T00:00:00Z",
 *            "instance_count": 22
 *          },
 *          {
 *            "cores": 40,
 *            "date": "2019-06-10T00:00:00Z",
 *            "instance_count": 20
 *          },
 *          {
 *            "cores": 56,
 *            "date": "2019-06-11T00:00:00Z",
 *            "instance_count": 28
 *          },
 *          {
 *            "cores": 52,
 *            "date": "2019-06-12T00:00:00Z",
 *            "instance_count": 26
 *          },
 *          {
 *            "cores": 48,
 *            "date": "2019-06-13T00:00:00Z",
 *            "instance_count": 24
 *          },
 *          {
 *            "cores": 44,
 *            "date": "2019-06-14T00:00:00Z",
 *            "instance_count": 22
 *          },
 *          {
 *            "cores": 40,
 *            "date": "2019-06-15T00:00:00Z",
 *            "instance_count": 20
 *          },
 *          {
 *            "cores": 20,
 *            "date": "2019-06-16T00:00:00Z",
 *            "instance_count": 20
 *          },
 *          {
 *            "cores": 80,
 *            "date": "2019-06-17T00:00:00Z",
 *            "instance_count": 40
 *          },
 *          {
 *            "cores": 43,
 *            "date": "2019-06-18T00:00:00Z",
 *            "instance_count": 18
 *          },
 *          {
 *            "cores": 50,
 *            "date": "2019-06-19T00:00:00Z",
 *            "instance_count": 22
 *          },
 *          {
 *            "cores": 40,
 *            "date": "2019-06-20T00:00:00Z",
 *            "instance_count": 20
 *          },
 *          {
 *            "cores": 6,
 *            "date": "2019-06-21T00:00:00Z",
 *            "instance_count": 6
 *          },
 *          {
 *            "cores": 2,
 *            "date": "2019-06-22T00:00:00Z",
 *            "instance_count": 2
 *          },
 *          {
 *            "cores": 4,
 *            "date": "2019-06-23T00:00:00Z",
 *            "instance_count": 4
 *          },
 *          {
 *            "cores": 6,
 *            "date": "2019-06-24T00:00:00Z",
 *            "instance_count": 6
 *          },
 *          {
 *            "cores": 10,
 *            "date": "2019-06-25T00:00:00Z",
 *            "instance_count": 10
 *          },
 *          {
 *            "cores": 2,
 *            "date": "2019-06-26T00:00:00Z",
 *            "instance_count": 4
 *          },
 *          {
 *            "cores": 0,
 *            "date": "2019-06-27T00:00:00Z",
 *            "instance_count": 0
 *          },
 *          {
 *            "cores": 6,
 *            "date": "2019-06-28T00:00:00Z",
 *            "instance_count": 2
 *          },
 *          {
 *            "cores": 4,
 *            "date": "2019-06-29T00:00:00Z",
 *            "instance_count": 2
 *          },
 *          {
 *            "cores": 2,
 *            "date": "2019-06-30T00:00:00Z",
 *            "instance_count": 2
 *          }
 *        ],
 *        "links": {
 *          "first": null,
 *          "last": null,
 *          "previous": null,
 *          "next": null
 *        },
 *        "meta": {
 *          "resultSetSize": 30,
 *          "product": "RHEL",
 *          "granularity": "DAILY"
 *        }
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
