import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import moxios from 'moxios';
import { multiActionMiddleware, promiseMiddleware } from '../../middleware';
import { graphReducer, inventoryReducer, viewReducer } from '../../reducers';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';
import { rhsmActions } from '../rhsmActions';

describe('RhsmActions', () => {
  const middleware = [multiActionMiddleware, promiseMiddleware];
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

    moxios.stubRequest(/\/(tally|capacity|instances|subscriptions|version).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1,
      response: {
        test: 'success',
        [rhsmConstants.RHSM_API_RESPONSE_DATA]: ['success']
      }
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for getGraphMetrics method', done => {
    const store = generateStore();
    const dispatcher = rhsmActions.getGraphMetrics([
      { id: 'lorem', metric: 'ipsum' },
      { id: 'dolor', metric: 'sit' },
      { id: 'lorem', metric: 'ipsum', isCapacity: true },
      { id: 'dolor', metric: 'sit', isCapacity: true }
    ]);

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().graph;
      expect(response.tally.ipsum_lorem.fulfilled).toBe(true);
      expect(response.tally.sit_dolor.fulfilled).toBe(true);
      expect(Object.entries(response.tally).length).toBe(2);

      expect(response.capacity.threshold_ipsum_lorem.fulfilled).toBe(true);
      expect(response.capacity.threshold_sit_dolor.fulfilled).toBe(true);
      expect(Object.entries(response.capacity).length).toBe(2);
      done();
    });
  });

  it('Should return response content for getInstancesInventory method', done => {
    const store = generateStore();
    const dispatcher = rhsmActions.getInstancesInventory();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().inventory;
      expect(response.instancesInventory.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return response content for getInstancesInventoryGuests method', done => {
    const store = generateStore();
    const dispatcher = rhsmActions.getInstancesInventoryGuests();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().inventory;
      expect(response.instancesGuests.fulfilled).toBe(true);
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
