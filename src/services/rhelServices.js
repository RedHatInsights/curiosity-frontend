import axios from 'axios';
import serviceConfig from './config';

/**
 * @apiMock {DelayResponse} 2000
 * @api {get} /api/cloudigrade/v2/concurrent/ Get graph data
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
            "first": "/api/cloudigrade/v2/concurrent/?end_date=2019-05-05&limit=10&offset=0&start_date=2019-05-01",
            "last": "/api/cloudigrade/v2/concurrent/?end_date=2019-05-05&limit=10&offset=0&start_date=2019-05-01",
            "next": null,
            "previous": null
          },
          "meta": {
            "count": 4
          }
 *     }
 *
 * @apiError {String} detail
 * @apiErrorExample {text} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "detail": "Failed because of {reasons}"
 *     }
 * @apiError {String} detail
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "detail": "Authentication credentials were not provided."
 *     }
 */
const getGraphReports = (params = {}) =>
  axios(
    serviceConfig(
      {
        url: process.env.REACT_APP_SERVICES_CLOUDMETER_REPORT,
        params
      },
      false
    )
  );

const rhelServices = { getGraphReports };

export { rhelServices as default, rhelServices, getGraphReports };
