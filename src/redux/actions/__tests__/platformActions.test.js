import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import moxios from 'moxios';
import { promiseMiddleware } from '../../middleware';
import { platformActions } from '../platformActions';
import { appReducer } from '../../reducers';

describe('PlatformActions', () => {
  const middleware = [promiseMiddleware()];
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

  it('Should return response content for createExport method', () => {
    const mockDispatch = jest.fn();
    platformActions.createExport(undefined, undefined, {
      poll: { location: undefined, status: undefined, validate: undefined }
    })(mockDispatch);
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch object');
  });

  it('Should return response content for getExistingExports method', () => {
    const mockDispatch = jest.fn();
    platformActions.getExistingExports([])(mockDispatch);
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch object');
  });

  it('Should return response content for getExistingExportsStatus method', () => {
    const mockDispatch = jest.fn();
    platformActions.getExistingExportsStatus()(mockDispatch);
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch object');
  });

  it('Should return response content for removeExistingExports method', () => {
    const mockDispatch = jest.fn();
    platformActions.deleteExistingExports([])(mockDispatch);
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch object');
  });
});
