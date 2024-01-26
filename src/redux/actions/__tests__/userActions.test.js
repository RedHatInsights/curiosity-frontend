import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import moxios from 'moxios';
import { appReducer } from '../../reducers';
import { userActions } from '../userActions';

describe('UserActions', () => {
  const middleware = [promiseMiddleware];
  const generateStore = () =>
    createStore(
      combineReducers({
        app: appReducer
      }),
      applyMiddleware(...middleware)
    );

  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(opt-in).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1,
      response: {
        test: 'success'
      }
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('Should return response content for getLocale method', done => {
    const store = generateStore();
    const dispatcher = userActions.getLocale();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().app;

      expect(response.locale.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return response content for deleteAccountOptIn method', done => {
    const store = generateStore();
    const dispatcher = userActions.deleteAccountOptIn();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().app;
      expect(response.optin.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return response content for getAccountOptIn method', done => {
    const store = generateStore();
    const dispatcher = userActions.getAccountOptIn();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().app;
      expect(response.optin.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return response content for updateAccountOptIn method', done => {
    const store = generateStore();
    const dispatcher = userActions.updateAccountOptIn();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().app;
      expect(response.optin.fulfilled).toBe(true);
      done();
    });
  });
});
