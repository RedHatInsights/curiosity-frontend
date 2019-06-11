import { reduxHelpers } from '../reduxHelpers';

describe('ReduxHelpers', () => {
  it('should have specific functions', () => {
    expect(reduxHelpers).toMatchSnapshot('reduxHelpers');
  });

  it('should support generated strings and flags', () => {
    expect(reduxHelpers.FULFILLED_ACTION('lorem')).toBe(`lorem_FULFILLED`);
    expect(reduxHelpers.PENDING_ACTION('lorem')).toBe(`lorem_PENDING`);
    expect(reduxHelpers.REJECTED_ACTION('lorem')).toBe(`lorem_REJECTED`);
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
