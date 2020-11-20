import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import moxios from 'moxios';
import { graphReducer, inventoryReducer, messagesReducer, viewReducer } from '../../reducers';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';
import { rhsmActions } from '../rhsmActions';

describe('RhsmActions', () => {
  const middleware = [promiseMiddleware];
  const generateStore = () =>
    createStore(
      combineReducers({
        graph: graphReducer,
        inventory: inventoryReducer,
        messages: messagesReducer,
        view: viewReducer
      }),
      applyMiddleware(...middleware)
    );

  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(tally|capacity|hosts|subscriptions|version).*?/, {
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

  it('Should return response content for getHostsInventoryGuests method', done => {
    const store = generateStore();
    const dispatcher = rhsmActions.getHostsInventoryGuests();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().inventory;
      expect(response.hostsGuests.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return response content for getMessageReports method', done => {
    const store = generateStore();
    const dispatcher = rhsmActions.getMessageReports();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().messages;
      expect(response.report.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return response content for getSubscriptionsInventory method', done => {
    const store = generateStore();
    const dispatcher = rhsmActions.getSubscriptionsInventory();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().inventory;
      expect(response.subscriptionsInventory.fulfilled).toBe(true);
      done();
    });
  });
});
