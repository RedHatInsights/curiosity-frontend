import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import moxios from 'moxios';
import { rhelGraphReducer, rhelViewReducer } from '../../reducers';
import { rhelApiTypes } from '../../../types/rhelApiTypes';
import { rhelActions } from '..';

describe('RhelActions', () => {
  const middleware = [promiseMiddleware];
  const generateStore = () =>
    createStore(
      combineReducers({
        rhelGraph: rhelGraphReducer,
        rhelView: rhelViewReducer
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
          test: 'success',
          [rhelApiTypes.CLOUDIGRADE_API_RESPONSE_CONCURRENT_DATA]: ['success']
        }
      });
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for getGraphReports method', done => {
    const store = generateStore();
    const dispatcher = rhelActions.getGraphReports();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().rhelGraph;

      expect(response.fulfilled).toBe(true);
      done();
    });
  });
});
