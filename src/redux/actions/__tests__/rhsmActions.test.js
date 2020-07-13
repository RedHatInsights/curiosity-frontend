import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import moxios from 'moxios';
import { graphReducer, inventoryReducer, viewReducer } from '../../reducers';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';
import { rhsmActions } from '../rhsmActions';

describe('RhsmActions', () => {
  const middleware = [promiseMiddleware];
  const generateStore = () =>
    createStore(
      combineReducers({
        graph: graphReducer,
        inventory: inventoryReducer,
        view: viewReducer
      }),
      applyMiddleware(...middleware)
    );

  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(tally|capacity|hosts|version).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1,
      response: {
        test: 'success',
        [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: ['success']
      }
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for getGraphReportsCapacity method', done => {
    const store = generateStore();
    const dispatcher = rhsmActions.getGraphReportsCapacity();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().graph;
      expect(response.reportCapacity.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return response content for getHostsInventory method', done => {
    const store = generateStore();
    const dispatcher = rhsmActions.getHostsInventory();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().inventory;
      expect(response.hostsInventory.fulfilled).toBe(true);
      done();
    });
  });
});
