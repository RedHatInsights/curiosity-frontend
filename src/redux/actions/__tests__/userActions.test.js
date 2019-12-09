import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import moxios from 'moxios';
import { userReducer } from '../../reducers';
import { userActions } from '../userActions';

describe('UserActions', () => {
  const middleware = [promiseMiddleware];
  const generateStore = () =>
    createStore(
      combineReducers({
        user: userReducer
      }),
      applyMiddleware(...middleware)
    );

  beforeEach(() => {
    moxios.install();

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          test: 'success'
        }
      });
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for authorizeUser method', done => {
    const store = generateStore();
    const dispatcher = userActions.authorizeUser();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().user;

      expect(response.session.fulfilled).toBe(true);
      expect(response.session.authorized).toBe(true);
      done();
    });
  });
});
