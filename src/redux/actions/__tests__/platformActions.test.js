import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { platformActions } from '../platformActions';
import { userReducer } from '../../reducers';

describe('PlatformActions', () => {
  const middleware = [promiseMiddleware];
  const generateStore = () =>
    createStore(
      combineReducers({
        user: userReducer
      }),
      applyMiddleware(...middleware)
    );

  it('Should return response content for authorizeUser method', done => {
    const store = generateStore();
    const dispatcher = platformActions.authorizeUser();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().user;

      expect(response.auth.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return a dispatch object for the hideGlobalFilter method', () => {
    expect(platformActions.hideGlobalFilter()).toMatchSnapshot('dispatch object');
  });

  it('Should return a function for the onNavigation method', () => {
    expect(platformActions.onNavigation()).toMatchSnapshot('function');

    window.insights.chrome.on = jest.fn().mockImplementation((id, value) => value('lorem'));
    const dispatch = obj => obj;
    expect(platformActions.onNavigation(event => `${event} ipsum`)(dispatch)).toMatchSnapshot('expected process');
  });

  it('Should return a dispatch object for the setAppName method', () => {
    expect(platformActions.setAppName()).toMatchSnapshot('dispatch object');
  });

  it('Should return a function for the setAppNav method', () => {
    expect(platformActions.setAppNav()).toMatchSnapshot('function');

    window.insights.chrome.navigation = jest.fn().mockImplementation(value => value);
    const dispatch = obj => obj;
    expect(platformActions.setAppNav('lorem')(dispatch)).toMatchSnapshot('expected process');
  });
});
