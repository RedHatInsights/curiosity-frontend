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
      reduxHelpers.getStatusFromResults({
        status: 200
      })
    ).toMatchSnapshot('fallback status');

    expect(reduxHelpers.getStatusFromResults({})).toMatchSnapshot('missing status');
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
});
