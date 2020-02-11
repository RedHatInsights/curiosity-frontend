import { reduxHelpers } from '../reduxHelpers';

describe('ReduxHelpers', () => {
  it('should have specific functions', () => {
    expect(reduxHelpers).toMatchSnapshot('reduxHelpers');
  });

  it('should support generated strings and flags', () => {
    expect(reduxHelpers.FULFILLED_ACTION('lorem')).toBe('lorem_FULFILLED');
    expect(reduxHelpers.PENDING_ACTION('lorem')).toBe('lorem_PENDING');
    expect(reduxHelpers.REJECTED_ACTION('lorem')).toBe('lorem_REJECTED');
    expect(reduxHelpers.HTTP_STATUS_RANGE('lorem')).toBe('lorem_STATUS_RANGE');
  });

  it('should get a message from a service call response', () => {
    expect(
      reduxHelpers.getMessageFromResults({
        response: {
          status: 200,
          statusText: 'OK',
          data: { lorem: 'ipsum', dolor: 'sit' }
        }
      })
    ).toMatchSnapshot('response for 2XX');

    expect(
      reduxHelpers.getMessageFromResults([
        {
          status: 200,
          statusText: 'OK',
          data: { lorem: 'ipsum', dolor: 'sit' }
        },
        {
          status: 200,
          statusText: 'OK',
          data: { hello: 'world' }
        }
      ])
    ).toMatchSnapshot('ARRAY response for 2XX');

    expect(
      reduxHelpers.getMessageFromResults({
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: { lorem: 'ipsum', dolor: 'sit' }
        },
        message: 'Request failed with status code 400'
      })
    ).toMatchSnapshot('response for 4XX');

    expect(
      reduxHelpers.getMessageFromResults([
        {
          status: 400,
          statusText: 'Bad Request',
          data: { lorem: 'ipsum', dolor: 'sit' },
          message: 'Request failed with status code 400'
        },
        {
          status: 400,
          statusText: 'Bad Request',
          data: { hello: 'world' },
          message: 'Request failed with status code 400'
        }
      ])
    ).toMatchSnapshot('ARRAY response for 4XX');

    expect(
      reduxHelpers.getMessageFromResults({
        response: {
          status: 300,
          statusText: 'Multiple Choices'
        }
      })
    ).toMatchSnapshot('3XX fallback message');

    expect(
      reduxHelpers.getMessageFromResults({
        response: {
          status: 400,
          statusText: 'Bad Request'
        }
      })
    ).toMatchSnapshot('4XX fallback message');

    expect(
      reduxHelpers.getMessageFromResults({
        response: {
          status: 500,
          statusText: 'Internal Server Error'
        }
      })
    ).toMatchSnapshot('5XX fallback message');

    expect(
      reduxHelpers.getMessageFromResults([
        {
          status: 200,
          statusText: 'OK',
          data: { lorem: 'ipsum', dolor: 'sit' }
        },
        {
          status: 400,
          statusText: 'Bad Request',
          data: { hello: 'world' },
          message: 'Request failed with status code 400'
        }
      ])
    ).toMatchSnapshot('ARRAY mismatched response messages');
  });

  it('should get a http status from a service call response', () => {
    expect(
      reduxHelpers.getStatusFromResults({
        response: {
          status: 200
        }
      })
    ).toMatchSnapshot('status');

    expect(
      reduxHelpers.getStatusFromResults([
        {
          status: 200
        },
        {
          status: 200
        }
      ])
    ).toMatchSnapshot('ARRAY status');

    expect(
      reduxHelpers.getStatusFromResults({
        status: 200
      })
    ).toMatchSnapshot('fallback status');

    expect(reduxHelpers.getStatusFromResults({})).toMatchSnapshot('missing status');

    expect(
      reduxHelpers.getStatusFromResults([
        {
          status: 200
        },
        {
          status: 400
        }
      ])
    ).toMatchSnapshot('ARRAY mismatched status');
  });

  it('should get a date from a service call response', () => {
    expect(
      reduxHelpers.getDateFromResults({
        headers: {
          date: 'Fri, 07 Feb 2020 10:46:53 GMT'
        }
      })
    ).toMatchSnapshot('date');

    expect(
      reduxHelpers.getDateFromResults([
        {
          headers: {
            date: 'Fri, 07 Feb 2020 10:46:53 GMT'
          },
          status: 200
        },
        {
          headers: {
            date: 'Fri, 07 Feb 2020 10:46:53 GMT'
          },
          status: 200
        }
      ])
    ).toMatchSnapshot('ARRAY date');
  });

  it('should update a state object', () => {
    const initialState = {
      lorem: false,
      ipsum: true
    };

    const state = {};
    state.ipsum = false;

    expect(
      reduxHelpers.setStateProp(
        null,
        {
          lorem: true
        },
        {
          state,
          initialState
        }
      )
    ).toMatchSnapshot('reset state object');

    state.ipsum = false;

    expect(
      reduxHelpers.setStateProp(
        null,
        {
          lorem: true
        },
        {
          state,
          reset: false
        }
      )
    ).toMatchSnapshot('dont reset state object');
  });

  it('should automate creating general promise action reducers', () => {
    const state = {};
    const action = {
      type: reduxHelpers.FULFILLED_ACTION('DOLOR'),
      payload: {
        headers: {
          date: 'Tue, 11 Feb 2020 15:27:16 GMT'
        },
        status: 200,
        statusText: 'OK',
        data: { lorem: 'ipsum', dolor: 'sit' }
      }
    };

    const fulfilledState = reduxHelpers.generatedPromiseActionReducer([{ type: 'DOLOR' }], state, action);

    action.type = reduxHelpers.PENDING_ACTION('DOLOR');
    action.payload = {};

    const pendingState = reduxHelpers.generatedPromiseActionReducer([{ type: 'DOLOR' }], state, action);

    action.type = reduxHelpers.REJECTED_ACTION('DOLOR');
    action.payload = {
      status: 400,
      statusText: 'Bad Request',
      data: { hello: 'world' },
      message: 'Request failed with status code 400'
    };

    const rejectedState = reduxHelpers.generatedPromiseActionReducer([{ type: 'DOLOR' }], state, action);

    expect({
      rejectedState,
      pendingState,
      fulfilledState
    }).toMatchSnapshot('generatedPromiseActionReducer basic updated state');
  });

  it('should automate creating promise action reducers with meta data', () => {
    const state = {};
    const action = {
      type: reduxHelpers.FULFILLED_ACTION('DOLOR'),
      meta: {
        query: { test: 'query' },
        data: 'test data',
        test: 'test property'
      },
      payload: {
        headers: {
          date: 'Tue, 11 Feb 2020 15:27:16 GMT'
        },
        status: 200,
        statusText: 'OK',
        data: { lorem: 'ipsum', dolor: 'sit' }
      }
    };

    const fulfilledState = reduxHelpers.generatedPromiseActionReducer([{ type: 'DOLOR' }], state, action);

    action.meta.id = 'test id';

    const appliedMetaIdFulfilledState = reduxHelpers.generatedPromiseActionReducer([{ type: 'DOLOR' }], state, action);

    expect({
      fulfilledState,
      appliedMetaIdFulfilledState
    }).toMatchSnapshot('generatedPromiseActionReducer passed meta data');
  });
});
