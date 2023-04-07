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
});
