import userSelectors from '../userSelectors';

describe('UserSelectors', () => {
  it('should return specific selectors', () => {
    expect(userSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(userSelectors.userSession(state)).toMatchSnapshot('missing reducer error');
  });

  it('should pass existing state data through response', () => {
    const state = {
      user: {
        session: {
          locale: 'en-US'
        }
      }
    };

    expect(userSelectors.userSession(state)).toMatchSnapshot('existing state data');
  });

  it('should pass error state data through response', () => {
    const state = {
      user: {
        session: {
          error: true,
          errorCodes: ['loremIpsum'],
          errorMessage: 'lorem ipsum',
          status: 403
        }
      }
    };

    expect(userSelectors.userSession(state)).toMatchSnapshot('error state data');
  });

  it('should pass transformed data on fulfill', () => {
    const state = {
      user: {
        session: {
          fulfilled: true,
          data: [
            {
              isAdmin: false,
              isEntitled: true
            },
            {
              permissions: [
                {
                  subscriptions: {
                    all: true,
                    resources: {
                      '*': {
                        '*': [],
                        loremCustom: [],
                        read: []
                      }
                    }
                  }
                }
              ],
              authorized: {
                subscriptions: true
              }
            }
          ]
        }
      }
    };

    expect(userSelectors.userSession(state)).toMatchSnapshot('fulfilled state data');
  });
});
