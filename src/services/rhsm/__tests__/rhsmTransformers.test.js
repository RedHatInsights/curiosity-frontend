import { rhsmTransformers } from '../rhsmTransformers';
import {
  rhsmConstants,
  RHSM_API_RESPONSE_TALLY_CAPACITY_DATA_TYPES as TALLY_CAPACITY_DATA_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../rhsmConstants';

describe('RHSM Transformers', () => {
  it('should have specific response transformers', () => {
    expect(rhsmTransformers).toMatchSnapshot('specific transformers');
  });

  it('should attempt to parse a capacity response', () => {
    const baseCapacity = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {}
    };

    expect(rhsmTransformers.tallyCapacity(baseCapacity, { _isCapacity: true })).toMatchSnapshot('capacity');

    const dailyCapacityResponse = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-14T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-15T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-16T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 1.4977989514668784,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-17T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 1.5547887908087836,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-18T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 4.446975872251722,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-19T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 4.69084013303121,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-20T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-21T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-22T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-23T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-24T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-25T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        }
      ],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {}
    };

    expect(rhsmTransformers.tallyCapacity(dailyCapacityResponse, { _isCapacity: true })).toMatchSnapshot(
      'capacity, daily like granularity'
    );

    const dailyCapacityFirstMonthResponse = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-20T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.1,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-21T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-22T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-23T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-24T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-25T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-26T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-27T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-28T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-29T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-30T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-31T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        }
      ],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {}
    };

    const transformedDailyCapacityFirstMonthResponse = rhsmTransformers.tallyCapacity(dailyCapacityFirstMonthResponse, {
      _isCapacity: true
    });

    expect(dailyCapacityFirstMonthResponse[rhsmConstants.RHSM_API_RESPONSE_DATA].length).toBe(12);
    expect(transformedDailyCapacityFirstMonthResponse.data.length).toBe(13);
    expect(transformedDailyCapacityFirstMonthResponse).toMatchSnapshot(
      'capacity, daily like first of month granularity'
    );

    const monthlyCapacityResponse = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-01-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-02-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-03-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-04-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-05-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 4.767144674723709,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-06-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 4.446975872251722,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-08-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_INFINITE_QUANTITY]: false
        }
      ],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {}
    };

    expect(rhsmTransformers.tallyCapacity(monthlyCapacityResponse, { _isCapacity: true })).toMatchSnapshot(
      'capacity, monthly like granularity'
    );
  });

  it('should attempt to parse an instances response', () => {
    expect(rhsmTransformers.instances(undefined)).toMatchSnapshot('instances, failed');

    const response = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
        {
          [rhsmConstants.RHSM_API_RESPONSE_INSTANCES_DATA_TYPES.MEASUREMENTS]: [1000, 0.0003456, 2]
        }
      ],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {
        [rhsmConstants.RHSM_API_RESPONSE_INSTANCES_META_TYPES.MEASUREMENTS]: ['c', 'a', 'b']
      }
    };

    expect(rhsmTransformers.instances(response)).toMatchSnapshot('instances');

    expect(
      rhsmTransformers.instances({
        ...response
      })
    ).toMatchSnapshot('instances, metric_id sockets');

    expect(
      rhsmTransformers.instances(
        {
          ...response
        },
        {
          params: {
            [rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES.METRIC_ID]: 'Sockets'
          }
        }
      )
    ).toMatchSnapshot('instances, metric_id sockets as parameter');

    expect(
      rhsmTransformers.instances({
        ...response
      })
    ).toMatchSnapshot('instances, metric_id cores');

    expect(
      rhsmTransformers.instances(
        {
          ...response
        },
        {
          params: {
            [rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES.METRIC_ID]: 'Cores'
          }
        }
      )
    ).toMatchSnapshot('instances, metric_id cores as parameter');
  });

  it('should attempt to parse a guests response', () => {
    expect(rhsmTransformers.guests(undefined)).toMatchSnapshot('guests, failed');

    const response = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
        {
          lorem: 'ipsum'
        }
      ],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {}
    };

    expect(rhsmTransformers.guests(response)).toMatchSnapshot('guests');

    rhsmTransformers.guests(
      {
        [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
          {
            lorem: 'ipsum'
          }
        ],
        [rhsmConstants.RHSM_API_RESPONSE_META]: {}
      },
      {
        params: { [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0, [RHSM_API_QUERY_SET_TYPES.LIMIT]: 1 },
        _id: 'test'
      }
    );

    rhsmTransformers.guests(
      {
        [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
          {
            dolor: 'sit'
          }
        ],
        [rhsmConstants.RHSM_API_RESPONSE_META]: {}
      },
      {
        params: { [RHSM_API_QUERY_SET_TYPES.OFFSET]: 1, [RHSM_API_QUERY_SET_TYPES.LIMIT]: 1 },
        _id: 'test'
      }
    );

    expect(
      rhsmTransformers.guests(
        {
          [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
            {
              hello: 'world'
            }
          ],
          [rhsmConstants.RHSM_API_RESPONSE_META]: {}
        },
        {
          params: { [RHSM_API_QUERY_SET_TYPES.OFFSET]: 2, [RHSM_API_QUERY_SET_TYPES.LIMIT]: 1 },
          _id: 'test'
        }
      )
    ).toMatchSnapshot('guests, cache');
  });

  it('should attempt to parse a subscriptions response', () => {
    expect(rhsmTransformers.subscriptions(undefined)).toMatchSnapshot('subscriptions, failed');

    const response = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
        {
          [rhsmConstants.RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES.METRIC_ID]: 'Cores'
        }
      ],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {}
    };

    expect(rhsmTransformers.subscriptions(response)).toMatchSnapshot('subscriptions, metric_id cores');

    expect(
      rhsmTransformers.subscriptions(
        {
          ...response
        },
        {
          params: {
            [rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES.METRIC_ID]: 'sockets'
          }
        }
      )
    ).toMatchSnapshot('subscriptions, metric_id sockets as parameter');

    expect(
      rhsmTransformers.subscriptions({
        [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
          {
            [rhsmConstants.RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES.METRIC_ID]: 'Cores'
          },
          {
            [rhsmConstants.RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES.METRIC_ID]: 'Sockets'
          }
        ],
        [rhsmConstants.RHSM_API_RESPONSE_META]: {}
      })
    ).toMatchSnapshot('subscriptions, metric_id sockets, cores response');
  });

  it('should attempt to parse a tally response', () => {
    const failedTallyResponse = undefined;

    expect(rhsmTransformers.tallyCapacity(failedTallyResponse)).toMatchSnapshot('tally, failed');

    const baseTallyResponse = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {}
    };

    expect(rhsmTransformers.tallyCapacity(baseTallyResponse)).toMatchSnapshot('tally');

    const dailyTallyResponse = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-14T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-15T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-16T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 1.4977989514668784,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-17T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 1.5547887908087836,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-18T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 4.446975872251722,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-19T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 4.69084013303121,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-20T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-21T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-22T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-23T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-24T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-25T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        }
      ],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {}
    };

    expect(rhsmTransformers.tallyCapacity(dailyTallyResponse)).toMatchSnapshot('tally, daily like granularity');

    const dailyTallyFirstMonthResponse = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-20T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.1,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-21T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-22T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-23T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-24T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-25T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-26T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-27T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-28T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-29T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-30T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-31T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        }
      ],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {}
    };

    const transformedDailyTallyFirstMonthResponse = rhsmTransformers.tallyCapacity(dailyTallyFirstMonthResponse);

    expect(dailyTallyFirstMonthResponse[rhsmConstants.RHSM_API_RESPONSE_DATA].length).toBe(12);
    expect(transformedDailyTallyFirstMonthResponse.data.length).toBe(13);
    expect(transformedDailyTallyFirstMonthResponse).toMatchSnapshot('tally, daily like first of month granularity');

    const monthlyTallyResponse = {
      [rhsmConstants.RHSM_API_RESPONSE_DATA]: [
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-01-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-02-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-03-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-04-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-05-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 4.767144674723709,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-06-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 4.446975872251722,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: true
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-07-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        },
        {
          [TALLY_CAPACITY_DATA_TYPES.DATE]: '2019-08-01T00:00:00Z',
          [TALLY_CAPACITY_DATA_TYPES.VALUE]: 0.0,
          [TALLY_CAPACITY_DATA_TYPES.HAS_DATA]: false
        }
      ],
      [rhsmConstants.RHSM_API_RESPONSE_META]: {}
    };

    expect(rhsmTransformers.tallyCapacity(monthlyTallyResponse)).toMatchSnapshot('tally, monthly like granularity');
  });
});
