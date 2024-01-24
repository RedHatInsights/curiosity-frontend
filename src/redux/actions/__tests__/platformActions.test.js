import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import moxios from 'moxios';
import { platformActions } from '../platformActions';
import { appReducer } from '../../reducers';

describe('PlatformActions', () => {
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

    moxios.stubRequest(/\/(export).*?/, {
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

  it('Should return response content for authorizeUser method', done => {
    const store = generateStore();
    const dispatcher = platformActions.authorizeUser();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().app;

      expect(response.auth.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return response content for createExport method', done => {
    const store = generateStore();
    const dispatcher = platformActions.createExport();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().app;
      expect(response.exports.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return response content for getExport method', () => {
    expect(platformActions.getExport()).toMatchSnapshot('dispatch object');
  });

  it('Should return response content for getExportStatus method', done => {
    const store = generateStore();
    const dispatcher = platformActions.getExportStatus();

    dispatcher(store.dispatch).then(() => {
      const response = store.getState().app;
      expect(response.exports.fulfilled).toBe(true);
      done();
    });
  });

  it('Should return a dispatch object for the hideGlobalFilter method', () => {
    expect(platformActions.hideGlobalFilter()).toMatchSnapshot('dispatch object');
  });
});
