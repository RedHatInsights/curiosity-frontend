import { downloadHelpers } from '../downloadHelpers';

describe('DownloadHelpers', () => {
  // Return a promise, or promise like, response for errors
  const returnPromiseAsync = async promiseAsyncCall => {
    let response;

    try {
      response = await promiseAsyncCall();
    } catch (e) {
      response = e;
    }

    return response;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should have specific functions', () => {
    expect(downloadHelpers).toMatchSnapshot('helpers');
  });

  it('should throw an error attempting to download data', async () => {
    const response = await returnPromiseAsync(downloadHelpers.downloadData);

    expect(response).toMatchSnapshot('download error');
  });

  it('should throw an error attempting to access a log', async () => {
    const response = await returnPromiseAsync(downloadHelpers.debugLog);

    expect(response).toMatchSnapshot('access error');
  });

  it('should attempt to download data', done => {
    const createObjectURL = jest.fn();
    const revokeObjectURL = jest.fn();

    window.URL = {
      createObjectURL,
      revokeObjectURL
    };

    downloadHelpers.downloadData().then(value => {
      expect({
        createObjectURL: createObjectURL.mock.calls,
        revokeObjectURL: revokeObjectURL.mock.calls
      }).toMatchSnapshot('download methods');
      expect(value).toMatchSnapshot('data download');
      done();
    });

    jest.runAllTimers();

    window.URL = {
      createObjectURL: undefined,
      revokeObjectURL: undefined
    };
  });
});
