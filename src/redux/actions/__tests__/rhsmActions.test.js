import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import moxios from 'moxios';
import { graphReducer, viewReducer } from '../../reducers';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';
import { rhsmActions } from '../rhsmActions';

describe('RhsmActions', () => {
  const middleware = [promiseMiddleware];
  const generateStore = () =>
    createStore(
      combineReducers({
        graph: graphReducer,
        view: viewReducer
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
          [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: ['success']
        }
      });
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for getGraphReports method', done => {
    const store = generateStore();
    const dispatcher = rhsmActions.getGraphReports();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().graph;
      expect(response.report.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return response content for getGraphCapacity method', done => {
    const store = generateStore();
    const dispatcher = rhsmActions.getGraphCapacity();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().graph;

      expect(response.capacity.fulfilled).toBe(true);
      done();
    });
  });
});
